import { Product, Alert } from "../types";
import { toast } from "sonner";

// Store notification count in localStorage
const NOTIFICATION_COUNT_KEY = "notification_count";
const LAST_NOTIFICATIONS_KEY = "last_notifications";

interface StoredNotification {
  id: string;
  product: Product;
  timestamp: number;
}

// Check if the browser supports notifications
const checkNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log(
      "Ce navigateur ne prend pas en charge les notifications de bureau"
    );
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

// Get and update notification count
export const getNotificationCount = (): number => {
  return parseInt(localStorage.getItem(NOTIFICATION_COUNT_KEY) || "0", 10);
};

export const incrementNotificationCount = (): void => {
  const count = getNotificationCount();
  localStorage.setItem(NOTIFICATION_COUNT_KEY, (count + 1).toString());
};

export const resetNotificationCount = (): void => {
  localStorage.setItem(NOTIFICATION_COUNT_KEY, "0");
};

// Store and retrieve last notifications
export const getLastNotifications = (): StoredNotification[] => {
  const notificationsJson = localStorage.getItem(LAST_NOTIFICATIONS_KEY);
  return notificationsJson ? JSON.parse(notificationsJson) : [];
};

const storeNotification = (product: Product): void => {
  const notifications = getLastNotifications();
  const newNotification: StoredNotification = {
    id: Date.now().toString(),
    product,
    timestamp: Date.now(),
  };

  // Keep only last 50 notifications
  notifications.unshift(newNotification);
  if (notifications.length > 50) {
    notifications.pop();
  }

  localStorage.setItem(LAST_NOTIFICATIONS_KEY, JSON.stringify(notifications));
  incrementNotificationCount();
};

// Store alert preferences in localStorage
const ALERTS_STORAGE_KEY = "product_alerts";

export const saveAlert = (alert: Alert): void => {
  const alerts = getAlerts();
  const existingAlertIndex = alerts.findIndex((a) => a.id === alert.id);

  if (existingAlertIndex >= 0) {
    alerts[existingAlertIndex] = alert;
  } else {
    alerts.push(alert);
  }

  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
};

export const getAlerts = (): Alert[] => {
  const alertsJson = localStorage.getItem(ALERTS_STORAGE_KEY);
  return alertsJson ? JSON.parse(alertsJson) : [];
};

export const deleteAlert = (alertId: string): void => {
  const alerts = getAlerts().filter((alert) => alert.id !== alertId);
  localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
};

export const toggleAlert = (alertId: string): void => {
  const alerts = getAlerts();
  const alert = alerts.find((a) => a.id === alertId);
  if (alert) {
    alert.isActive = !alert.isActive;
    saveAlert(alert);
  }
};

// Check if a product matches any active alerts
export const checkProductAlerts = async (product: Product): Promise<void> => {
  const hasPermission = await checkNotificationPermission();
  if (!hasPermission) return;

  const alerts = getAlerts().filter((alert) => alert.isActive);

  for (const alert of alerts) {
    const matchesProduct = product.name
      .toLowerCase()
      .includes(alert.productName.toLowerCase());
    const matchesSupermarket =
      alert.supermarket === "any" || product.supermarket === alert.supermarket;
    const belowThreshold = product.clearancePrice <= alert.priceThreshold;

    if (matchesProduct && matchesSupermarket && belowThreshold) {
      // Store notification
      storeNotification(product);

      // Show browser notification
      const notification = new Notification("Nouveau produit en promotion !", {
        body: `${product.name} est disponible à ${product.clearancePrice} FCFA chez ${product.supermarket}`,
        icon: product.image,
        tag: product.id, // Prevent duplicate notifications
        requireInteraction: true, // Keep notification visible until user interacts
      });

      // Handle notification click
      notification.onclick = () => {
        // Focus or open the window
        window.focus();
        // Dispatch custom event to handle product selection
        window.dispatchEvent(
          new CustomEvent("showProduct", { detail: product })
        );
      };

      // Show in-app notification
      toast.info(`${product.name} correspond à votre alerte de prix !`, {
        description: `Disponible à ${product.clearancePrice} FCFA chez ${product.supermarket}`,
        duration: 5000,
        action: {
          label: "Voir",
          onClick: () => {
            window.dispatchEvent(
              new CustomEvent("showProduct", { detail: product })
            );
          },
        },
      });
    }
  }
};

// Simulate new products for testing
export const simulateNewProduct = () => {
  const mockProduct: Product = {
    id: Date.now().toString(),
    name: "Yaourt Nature Bio",
    description: "Yaourt nature biologique",
    image: "https://picsum.photos/seed/1/200/200",
    supermarket: "Carrefour",
    originalPrice: 1500,
    clearancePrice: 750,
    discount: 50,
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(),
    stock: 10,
    supermarketLocation: {
      address: "123 Rue du Commerce",
      distance: 1.2,
    },
    storageInstructions: "À conserver au frais",
    nutritionalInfo: {
      calories: 150,
      protein: 5,
      carbs: 12,
      fat: 8,
    },
    allergens: ["Lait"],
    ingredients: ["Lait entier", "Ferments lactiques"],
  };

  checkProductAlerts(mockProduct);
};

// Start simulation timer
export const startSimulation = () => {
  // Simulate a new product after 1 minute
  setTimeout(simulateNewProduct, 30000);
};

// Subscribe to server-sent events for real-time product updates
export const subscribeToProductUpdates = (
  onNewProduct: (product: Product) => void
) => {
  const eventSource = new EventSource("/api/products/stream");

  eventSource.onmessage = (event) => {
    const product = JSON.parse(event.data);
    onNewProduct(product);
    checkProductAlerts(product);
  };

  eventSource.onerror = () => {
    console.error("Erreur de connexion aux mises à jour produits");
    eventSource.close();
    // Retry connection after 5 seconds
    setTimeout(() => subscribeToProductUpdates(onNewProduct), 5000);
  };

  // Start simulation for testing
  startSimulation();

  return () => eventSource.close();
};
