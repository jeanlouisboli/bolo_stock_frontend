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
