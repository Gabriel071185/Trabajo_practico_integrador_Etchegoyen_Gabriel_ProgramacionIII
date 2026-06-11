import type { Product } from './Product';

export interface CartItem {
  product: Product;
  cantidad: number;
  subtotal: number;
}