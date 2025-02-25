// Product type
export type TProduct = {
  name: string;
  brand: string;
  model: string;
  price: number;
  imageUrl: string;
  category: 'Mountain' | 'Road' | 'Hybrid' | 'Electric';
  description: string;
  quantity: number;
  inStock: boolean;
  isDeleted?: boolean;
};
