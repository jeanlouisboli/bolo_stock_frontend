import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  TrendingDown,
  MapPin,
  Clock,
  ShieldAlert,
  Thermometer,
  Trash2,
} from "lucide-react";

interface ProductDetailsProps {
  product: Product;
  onClose: () => void;
  isOpen: boolean;
  onSubmitOrder: (orderDetails: OrderDetails) => void;
}

interface OrderForm {
  name: string;
  phone: string;
  needsDelivery: boolean;
  address: string;
}

export interface OrderDetails {
  product: Product;
  quantity: number;
  total: number;
  customerInfo: OrderForm;
}

const STORAGE_KEY = "userOrderInfo";

const loadUserInfo = (): OrderForm => {
  const savedInfo = localStorage.getItem(STORAGE_KEY);
  if (savedInfo) {
    return JSON.parse(savedInfo);
  }
  return {
    name: "",
    phone: "",
    needsDelivery: false,
    address: "",
  };
};

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
  isOpen,
  onSubmitOrder,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [orderForm, setOrderForm] = useState<OrderForm>(loadUserInfo);

  useEffect(() => {
    // Load saved user info when component mounts
    setOrderForm(loadUserInfo());
  }, []);

  const handleSubmitOrder = () => {
    if (
      !orderForm.name ||
      !orderForm.phone ||
      (orderForm.needsDelivery && !orderForm.address)
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Save user info to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orderForm));

    const orderDetails: OrderDetails = {
      product,
      quantity,
      total: product.clearancePrice * quantity,
      customerInfo: orderForm,
    };

    onSubmitOrder(orderDetails);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setOrderForm((prev) => ({ ...prev, needsDelivery: checked }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails du produit</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {/* Image and Basic Info */}
          <div className="grid gap-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary dark:text-primary-dark flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  {product.discount}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>

          {/* Price and Supermarket Info */}
          <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Prix original</p>
                <p className="text-lg line-through">
                  {product.originalPrice} FCFA
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Prix en promotion
                </p>
                <p className="text-lg font-bold text-primary">
                  {product.clearancePrice} FCFA
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{product.supermarketLocation?.address}</span>
              <span className="font-medium">
                ({product.supermarketLocation?.distance})
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid gap-4">
            {/* Expiry and Storage */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Expire le: {product.expiryDate}</span>
              </div>
              {product.storageInstructions && (
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <span>{product.storageInstructions}</span>
                </div>
              )}
            </div>

            {/* Nutritional Info */}
            {product.nutritionalInfo && (
              <div className="grid gap-2">
                <h3 className="font-medium">Information nutritionnelle</h3>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="p-2 border rounded">
                    <p className="text-muted-foreground">Calories</p>
                    <p className="font-medium">
                      {product.nutritionalInfo.calories}
                    </p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="text-muted-foreground">Protéines</p>
                    <p className="font-medium">
                      {product.nutritionalInfo.protein}g
                    </p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="text-muted-foreground">Glucides</p>
                    <p className="font-medium">
                      {product.nutritionalInfo.carbs}g
                    </p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="text-muted-foreground">Lipides</p>
                    <p className="font-medium">
                      {product.nutritionalInfo.fat}g
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-warning" />
                <span className="text-sm">
                  Allergènes: {product.allergens.join(", ")}
                </span>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="space-y-1">
                <h3 className="font-medium">Ingrédients</h3>
                <p className="text-sm text-muted-foreground">
                  {product.ingredients.join(", ")}
                </p>
              </div>
            )}
          </div>

          {/* Order Section */}
          <div className="grid gap-4 pt-4 border-t">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Informations personnelles</h3>
                {(orderForm.name || orderForm.phone || orderForm.address) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOrderForm({
                        name: "",
                        phone: "",
                        needsDelivery: false,
                        address: "",
                      });
                      localStorage.removeItem(STORAGE_KEY);
                    }}
                    className="text-destructive hover:text-destructive/90 flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Effacer le formulaire</span>
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={orderForm.name}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Entrez votre nom"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone *</Label>
                <Input
                  id="phone"
                  value={orderForm.phone}
                  onChange={(e) =>
                    setOrderForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Ex: 77 123 45 67"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="delivery"
                  checked={orderForm.needsDelivery}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="delivery">Je souhaite être livré</Label>
              </div>

              {orderForm.needsDelivery && (
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Input
                    id="address"
                    value={orderForm.address}
                    onChange={(e) =>
                      setOrderForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Entrez votre adresse complète"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="quantity">Quantité</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">
                      ({product.stock})
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">
                    {(product.clearancePrice * quantity).toLocaleString()} FCFA
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSubmitOrder}>Continuer</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;
