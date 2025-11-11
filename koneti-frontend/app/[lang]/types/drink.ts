export interface Drink {
  _id: string;
  name: string;
  price: number;
  image?: string;
  imageUrl?: string;
  categoryId?: string;
  category?: {
    _id: string;
    name: Record<string, string> | string;
  };
}
