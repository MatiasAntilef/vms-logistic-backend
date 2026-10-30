export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductType = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductType = Partial<CreateProductType>;
export type GetProductType = Omit<Product, "createdAt" | "updatedAt">;
