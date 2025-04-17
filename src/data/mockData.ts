import { Product, Supermarket, Alert } from "../types";

const supermarkets = ["Carrefour", "Auchan", "Casino", "Leader Price"];
const productNames = [
  "Yaourt Nature",
  "Lait Demi-écrémé",
  "Fromage Blanc",
  "Beurre Doux",
  "Crème Fraîche",
  "Œufs Bio",
  "Pain de Mie",
  "Jambon Blanc",
  "Poulet Rôti",
  "Saumon Fumé",
];

function generateMockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `product-${index + 1}`,
    name: `${productNames[index % productNames.length]} ${
      Math.floor(index / productNames.length) + 1
    }`,
    image: `https://picsum.photos/seed/${index + 1}/200/200`,
    supermarket: supermarkets[index % supermarkets.length],
    originalPrice: Math.floor(Math.random() * 5000) + 1000,
    discount: Math.floor(Math.random() * 50) + 10,
    description: `Description du produit ${index + 1}`,
    supermarketLocation: {
      address: `123 Main St`,
      distance: 1.2,
    },
    storageInstructions: `Instructions de stockage du produit ${index + 1}`,
    nutritionalInfo: {
      calories: Math.floor(Math.random() * 100) + 100,
      protein: Math.floor(Math.random() * 10) + 1,
      carbs: Math.floor(Math.random() * 10) + 1,
      fat: Math.floor(Math.random() * 10) + 1,
    },
    allergens: [`Allergène ${index + 1}`],
    ingredients: [`Ingrédient ${index + 1}`],
    stock: Math.floor(Math.random() * 100) + 1,
    expiryDate: new Date(
      Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(),
    get clearancePrice() {
      return Math.floor(this.originalPrice * (1 - this.discount / 100));
    },
  }));
}

// Generate 50 products
export const mockProducts = generateMockProducts(50);

// Simulate backend pagination
export const fetchProducts = async (
  page: number,
  limit: number = 10
): Promise<Product[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const start = page * limit;
  const end = start + limit;

  return mockProducts.slice(start, end);
};

export const mockSupermarkets: Supermarket[] = [
  {
    id: "1",
    name: "FreshMart",
    location: "123 Main St",
    distance: 1.2,
    rating: 4.5,
  },
  {
    id: "2",
    name: "BakeryPlus",
    location: "456 Oak Ave",
    distance: 2.5,
    rating: 4.2,
  },
  {
    id: "3",
    name: "DairyDelight",
    location: "789 Pine Rd",
    distance: 3.1,
    rating: 4.7,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "1",
    productName: "Yaourt Nature",
    category: "Produits Laitiers",
    supermarket: "Carrefour",
    priceThreshold: 500,
    isActive: true,
  },
  {
    id: "2",
    productName: "Pain de Mie",
    category: "Boulangerie",
    supermarket: "Auchan",
    priceThreshold: 800,
    isActive: false,
  },
];
