export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  supermarket: string;
  originalPrice: number;
  clearancePrice: number;
  discount: number;
  stock: number;
  expiryDate: string;
  category: string;
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens?: string[];
  storageInstructions?: string;
  ingredients?: string[];
  supermarketLocation?: {
    address: string;
    distance: string;
  };
}

export interface Supermarket {
  id: string;
  name: string;
  location: string;
  distance: number;
  rating: number;
}

export interface Alert {
  id: string;
  productName: string;
  category: string;
  supermarket: string;
  priceThreshold: number;
  isActive: boolean;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "delivered";
  deliveryAddress: string;
  contactNumber: string;
}
