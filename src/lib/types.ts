export type Role = "buyer" | "vendor";

export type Vendor = {
  id: string;
  name: string;
  location: string;
  pickupInstructions: string;
  rating: number;
  itemsSold: number;
};

export type Product = {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  photoUrl?: string;
  quantityAvailable: number;
  expiresAt: string; // ISO date string
};
