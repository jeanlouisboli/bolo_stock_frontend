import React, { useState, useEffect } from "react";
import { Product } from "./types";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ShoppingCart, Package, Bell } from "lucide-react";
import { Button } from "./components/ui/button";
import { useTheme } from "./components/theme-provider";
import AppLayout from "./components/layout/AppLayout";
import ProductList from "./components/products/ProductList";
import OrderList from "./components/orders/OrderList";
import OrderConfirmDialog from "./components/orders/OrderConfirmDialog";
import { toast, Toaster } from "sonner";
import ProductDetails, { OrderDetails } from "./components/ProductDetails";
import { AlertManager } from "./components/alerts/AlertManager";
import {
  subscribeToProductUpdates,
  getNotificationCount,
  resetNotificationCount,
} from "./services/notifications";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "alerts" | "orders">(
    "products"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Subscribe to product updates when the component mounts
    const unsubscribe = subscribeToProductUpdates((product) => {
      console.log("New product received:", product);
    });

    // Handle notification clicks
    const handleShowProduct = (event: CustomEvent<Product>) => {
      setSelectedProduct(event.detail);
      setActiveTab("products");
    };

    window.addEventListener("showProduct", handleShowProduct as EventListener);

    // Update notification count
    const updateNotificationCount = () => {
      setNotificationCount(getNotificationCount());
    };

    // Update count initially and when storage changes
    updateNotificationCount();
    window.addEventListener("storage", updateNotificationCount);

    return () => {
      unsubscribe();
      window.removeEventListener(
        "showProduct",
        handleShowProduct as EventListener
      );
      window.removeEventListener("storage", updateNotificationCount);
    };
  }, []);

  // Reset notification count when opening alerts tab
  useEffect(() => {
    if (activeTab === "alerts") {
      resetNotificationCount();
      setNotificationCount(0);
    }
  }, [activeTab]);

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOrderDetailsSubmit = (details: OrderDetails) => {
    setOrderDetails(details);
    setSelectedProduct(null);
  };

  const handleConfirmOrder = async () => {
    if (!orderDetails) return;

    setIsOrdering(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Commande confirmée avec succès !");
      setActiveTab("products");
    } catch (error) {
      toast.error("Erreur lors de la commande");
    } finally {
      setIsOrdering(false);
      setOrderDetails(null);
    }
  };

  return (
    <AppLayout>
      <div className="flex min-h-full flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-surface/80 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
          <div className="flex h-12 items-center px-2">
            <h1 className="mr-2 text-lg font-bold">Bolo Stock</h1>
            <nav className="flex flex-1 items-center space-x-2 pl-4">
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                onClick={() => setActiveTab("products")}
                className="h-8 px-3"
                size="sm"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
              </Button>
              <Button
                variant={activeTab === "alerts" ? "default" : "ghost"}
                onClick={() => setActiveTab("alerts")}
                className="h-8 px-3 relative"
                size="sm"
              >
                <Bell className="mr-2 h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "ghost"}
                onClick={() => setActiveTab("orders")}
                className="h-8 px-3"
                size="sm"
              >
                <Package className="mr-2 h-4 w-4" />
              </Button>
            </nav>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto py-2">
          <AnimatePresence mode="wait">
            {activeTab === "products" && <ProductList onOrder={handleOrder} />}
            {activeTab === "alerts" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="container mx-auto px-4"
              >
                <AlertManager />
              </motion.div>
            )}
            {activeTab === "orders" && <OrderList />}
          </AnimatePresence>
        </main>

        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSubmitOrder={handleOrderDetailsSubmit}
          />
        )}

        {orderDetails && (
          <OrderConfirmDialog
            open={!!orderDetails}
            onOpenChange={(open) => !open && setOrderDetails(null)}
            onConfirm={handleConfirmOrder}
            orderDetails={orderDetails}
            isLoading={isOrdering}
          />
        )}
      </div>
      <Toaster richColors position="top-center" />
    </AppLayout>
  );
};

export default App;
