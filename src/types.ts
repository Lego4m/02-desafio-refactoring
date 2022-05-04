export interface FoodProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

export type FoodProductInput = Omit<FoodProduct, 'id' | 'available' >;