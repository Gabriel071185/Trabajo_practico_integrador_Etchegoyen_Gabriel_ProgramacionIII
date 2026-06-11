import type { UserSession } from './User';
import type { Product } from './Product';

export type EstadoPedido = 'PENDIENTE' | 'EN_PREPARACION' | 'ENTREGADO' | 'CANCELADO';
export type FormaPago = 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO';

export interface DetallePedido {
  cantidad: number;
  subtotal: number;
  producto: Product;
}

export interface Order {
  id: number;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  formaPago: FormaPago;
  detalles: DetallePedido[];
  usuarioDto: UserSession;
}