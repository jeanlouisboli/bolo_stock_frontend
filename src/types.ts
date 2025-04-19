export interface Product {
  id: string;
  name: string;
  image: string;
  supermarket: string;
  originalPrice: number;
  clearancePrice: number;
  discount: number;
  expiryDate: string;
  description: string;
  supermarketLocation: supermarketLocation;
  storageInstructions: string;
  nutritionalInfo: nutritionalInfo;
  allergens: string[];
  ingredients: string[];
  stock: number;
}

export interface supermarketLocation {
  address: string;
  distance: number;
}

export interface nutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type OrderStatus =
  | "pending" // Order placed but not confirmed
  | "confirmed" // Order confirmed by supermarket
  | "preparing" // Order being prepared
  | "ready" // Ready for pickup
  | "completed" // Order picked up
  | "cancelled"; // Order cancelled

export interface Order {
  id: string;
  code: string; // Order tracking code
  product: Product;
  quantity: number;
  status: OrderStatus;
  orderDate: string;
  totalPrice: number;
  estimatedPickupTime?: string;
  pickupLocation: string;
  customerNotes?: string;
}

export interface Alert {
  id: string;
  productName: string;
  category: string;
  supermarket: string;
  priceThreshold: number;
  isActive: boolean;
}

export interface Supermarket {
  id: string;
  name: string;
  location: string;
  distance: number;
  rating: number;
}
