import React from "react";
import { Loader2 } from "lucide-react";
import { OrderDetails } from "../ProductDetails";
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

interface OrderConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderDetails: OrderDetails;
  isLoading: boolean;
}

export const OrderConfirmDialog: React.FC<OrderConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  orderDetails: { product, quantity, total, customerInfo },
  isLoading,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="max-h-[90vh] overflow-y-auto">
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmer la commande</AlertDialogTitle>
        <AlertDialogDescription className="space-y-4">
          <div className="flex items-start gap-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-20 w-20 rounded-md object-cover"
            />
            <div className="space-y-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.supermarket}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm line-through text-muted-foreground">
                  {product.originalPrice} FCFA
                </span>
                <span className="font-medium text-primary">
                  {product.clearancePrice} FCFA
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <p className="font-medium">Détails de la commande :</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Quantité : {quantity}</li>
              <li>• Total : {total} FCFA</li>
              <li>• À retirer chez {product.supermarket}</li>
              <li>• Date d'expiration : {product.expiryDate}</li>
              <li>
                • Instructions de stockage : {product.storageInstructions}
              </li>
            </ul>
          </div>

          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <p className="font-medium">Informations client :</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Nom : {customerInfo.name}</li>
              <li>• Téléphone : {customerInfo.phone}</li>
              {customerInfo.needsDelivery && (
                <li>• Adresse de livraison : {customerInfo.address}</li>
              )}
              <li>
                • Mode :{" "}
                {customerInfo.needsDelivery
                  ? "Livraison"
                  : "Retrait en magasin"}
              </li>
            </ul>
          </div>
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
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirmer la commande"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default OrderConfirmDialog;
