export interface Cart {
  id: string;
  userId: string;
  products: CartProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface CartProduct {
  productId: string;
  quantity: number;
}
