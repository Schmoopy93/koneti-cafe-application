export interface Drink {
  _id: string;
  name: Record<string, string> | string;
  price: number;
  description?: string;
  image?: string;
  imageUrl?: string;
  categoryId?: string;
  category?: {
    _id: string;
    name: Record<string, string> | string;
  };
}
