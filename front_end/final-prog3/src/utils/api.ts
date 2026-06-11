import type { Product } from '../types/Product';
import type { Category } from '../types/Category';
import type { User } from '../types/User';
import type { Order } from '../types/Order';

const BASE_PATH = '/data';

// Helper genérico para fetch
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Productos
export async function getProducts(): Promise<Product[]> {
  return fetchJSON<Product[]>(`${BASE_PATH}/productos.json`);
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

// Categorías
export async function getCategories(): Promise<Category[]> {
  return fetchJSON<Category[]>(`${BASE_PATH}/categorias.json`);
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(c => c.id === id);
}

// Usuarios
export async function getUsers(): Promise<User[]> {
  return fetchJSON<User[]>(`${BASE_PATH}/usuarios.json`);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.mail === email);
}

// Pedidos
export async function getOrders(): Promise<Order[]> {
  return fetchJSON<Order[]>(`${BASE_PATH}/pedidos.json`);
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  const orders = await getOrders();
  return orders.filter(o => o.usuarioDto.id === userId);
}