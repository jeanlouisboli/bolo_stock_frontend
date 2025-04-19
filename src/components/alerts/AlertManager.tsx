import React, { useState, useEffect } from "react";
import { Alert } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Bell, Plus, Trash2 } from "lucide-react";
import {
  getAlerts,
  saveAlert,
  deleteAlert,
  toggleAlert,
} from "../../services/notifications";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export const AlertManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({
    productName: "",
    category: "",
    supermarket: "any",
    priceThreshold: 0,
    isActive: true,
  });

  useEffect(() => {
    setAlerts(getAlerts());
  }, []);

  const handleAddAlert = () => {
    if (!newAlert.productName || !newAlert.priceThreshold) {
      return;
    }

    const alert: Alert = {
      id: Date.now().toString(),
      productName: newAlert.productName,
      category: newAlert.category || "Tous",
      supermarket: newAlert.supermarket || "any",
      priceThreshold: newAlert.priceThreshold,
      isActive: true,
    };

    saveAlert(alert);
    setAlerts(getAlerts());
    setIsAddDialogOpen(false);
    setNewAlert({
      productName: "",
      category: "",
      supermarket: "any",
      priceThreshold: 0,
      isActive: true,
    });
  };

  const handleDeleteAlert = (alertId: string) => {
    deleteAlert(alertId);
    setAlerts(getAlerts());
  };

  const handleToggleAlert = (alertId: string) => {
    toggleAlert(alertId);
    setAlerts(getAlerts());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alertes de prix</h2>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvelle alerte
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium">{alert.productName}</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {alert.category} •{" "}
                {alert.supermarket === "any"
                  ? "Tous les magasins"
                  : alert.supermarket}
              </p>
              <p className="text-sm">
                Seuil de prix:{" "}
                <span className="font-medium">{alert.priceThreshold} FCFA</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={alert.isActive}
                onCheckedChange={() => handleToggleAlert(alert.id)}
                aria-label="Toggle alert"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteAlert(alert.id)}
                className="text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
            <h3 className="mt-2 font-medium">Aucune alerte</h3>
            <p className="text-sm text-muted-foreground">
              Créez une alerte pour être notifié des promotions sur vos produits
              préférés.
            </p>
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle alerte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Nom du produit</Label>
              <Input
                id="productName"
                value={newAlert.productName}
                onChange={(e) =>
                  setNewAlert((prev) => ({
                    ...prev,
                    productName: e.target.value,
                  }))
                }
                placeholder="Ex: Yaourt Nature"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie (optionnel)</Label>
              <Input
                id="category"
                value={newAlert.category}
                onChange={(e) =>
                  setNewAlert((prev) => ({ ...prev, category: e.target.value }))
                }
                placeholder="Ex: Produits Laitiers"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supermarket">Supermarché</Label>
              <select
                id="supermarket"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={newAlert.supermarket}
                onChange={(e) =>
                  setNewAlert((prev) => ({
                    ...prev,
                    supermarket: e.target.value,
                  }))
                }
              >
                <option value="any">Tous les magasins</option>
                <option value="Carrefour">Carrefour</option>
                <option value="Auchan">Auchan</option>
                <option value="Casino">Casino</option>
                <option value="Leader Price">Leader Price</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceThreshold">Seuil de prix (FCFA)</Label>
              <Input
                id="priceThreshold"
                type="number"
                min="0"
                value={newAlert.priceThreshold}
                onChange={(e) =>
                  setNewAlert((prev) => ({
                    ...prev,
                    priceThreshold: Number(e.target.value),
                  }))
                }
                placeholder="Ex: 500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAddAlert}>Créer l'alerte</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
