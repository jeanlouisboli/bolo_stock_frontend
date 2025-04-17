import React, { useState } from "react";
import { Product } from "./types";
import { mockAlerts } from "./data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ShoppingCart, Package } from "lucide-react";
import { Button } from "./components/ui/button";
import { Switch } from "./components/ui/switch";
import { useTheme } from "./components/theme-provider";
import AppLayout from "./components/layout/AppLayout";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/products/ProductList";
import OrderList from "./components/orders/OrderList";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"products" | "alerts" | "orders">(
    "products"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { theme, setTheme } = useTheme();

  const handleOrder = (product: Product) => {
    setSelectedProduct(product);
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
              {/* DON'T DELETE THIS COMMENT */}
              {/* <Button
                variant={activeTab === "alerts" ? "default" : "ghost"}
                onClick={() => setActiveTab("alerts")}
                className="h-8 px-3"
                size="sm"
              >
                <Bell className="mr-2 h-4 w-4" />
              </Button> */}
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
                className="space-y-3"
              >
                {mockAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-lg border bg-surface p-3 dark:bg-surface-dark"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">
                        {alert.productName}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {alert.category} • {alert.supermarket}
                      </p>
                      <p className="text-xs">
                        Seuil de prix:{" "}
                        <span className="font-medium">
                          ${alert.priceThreshold}
                        </span>
                      </p>
                    </div>
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => {}}
                      aria-label="Activer/Désactiver l'alerte"
                    />
                  </div>
                ))}
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
          />
        )}
      </div>
    </AppLayout>
  );
};

export default App;
