import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { Order, OrderStatus } from "../../types";
import { fetchOrders, cancelOrder } from "../../data/mockData";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import OrderCode from "./OrderCode";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    pending: {
      label: "En attente",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    confirmed: {
      label: "Confirmé",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    preparing: {
      label: "En préparation",
      className:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    ready: {
      label: "Prêt",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    completed: {
      label: "Terminé",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    },
    cancelled: {
      label: "Annulé",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };

interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderCode: string;
  isLoading: boolean;
}

const CancelConfirmDialog: React.FC<CancelConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  orderCode,
  isLoading,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Annuler la commande</AlertDialogTitle>
        <AlertDialogDescription className="space-y-2">
          <p>Êtes-vous sûr de vouloir annuler cette commande ?</p>
          <OrderCode code={orderCode} />
          <p className="text-red-600 dark:text-red-400">
            Cette action ne peut pas être annulée.
          </p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          disabled={isLoading}
          onClick={() => onOpenChange(false)}
        >
          Annuler
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={(e) => {
            e.preventDefault();
            onConfirm();
          }}
          disabled={isLoading}
          className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-800"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirmer l'annulation"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleCancelOrder = async (order: Order) => {
    setSelectedOrder(order);
    setConfirmDialogOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      setCancellingOrderId(selectedOrder.id);
      const updatedOrder = await cancelOrder(selectedOrder.id);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id ? updatedOrder : order
        )
      );
      toast.success("Commande annulée avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'annulation"
      );
    } finally {
      setCancellingOrderId(null);
      setConfirmDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const lastOrderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const newOrders = await fetchOrders(page);
        setOrders((prev) => [...prev, ...newOrders]);
        setHasMore(newOrders.length === 5);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Erreur lors du chargement des commandes");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [page]);

  if (orders.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex h-[400px] items-center justify-center rounded-lg border bg-surface dark:bg-surface-dark"
      >
        <p className="text-sm text-muted-foreground">
          Aucune commande pour le moment
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-4"
      >
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            ref={index === orders.length - 1 ? lastOrderRef : null}
            layout
            className="rounded-lg border bg-surface p-4 dark:bg-surface-dark"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{order.product.name}</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      statusConfig[order.status].className
                    )}
                  >
                    {statusConfig[order.status].label}
                  </span>
                </div>
                <OrderCode code={order.code} />
                <p className="text-sm text-muted-foreground">
                  {order.product.supermarket} • {order.quantity} unité
                  {order.quantity > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{order.totalPrice} FCFA</p>
                {order.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                    onClick={() => handleCancelOrder(order)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted-foreground">
                Commandé le: {order.orderDate}
              </p>
              {order.estimatedPickupTime && (
                <p className="text-muted-foreground">
                  Retrait estimé: {order.estimatedPickupTime}
                </p>
              )}
              <p className="text-muted-foreground">
                Lieu de retrait: {order.pickupLocation}
              </p>
              {order.customerNotes && (
                <p className="text-muted-foreground">
                  Note: {order.customerNotes}
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}
      </motion.div>

      {selectedOrder && (
        <CancelConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          onConfirm={confirmCancelOrder}
          orderCode={selectedOrder.code}
          isLoading={cancellingOrderId === selectedOrder.id}
        />
      )}
    </>
  );
};

export default OrderList;
