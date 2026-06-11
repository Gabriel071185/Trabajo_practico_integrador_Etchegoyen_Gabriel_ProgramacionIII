import { getCurrentSession } from '../../../utils/auth';
import { getCategories, getProducts, getOrders } from '../../../utils/api';
import type { Category, Product, Order } from '../../../types';
import '../../../assets/styles/admin.css';

export class AdminDashboardPage {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    const session = getCurrentSession();
    if (!session || session.rol !== 'ADMIN') {
      window.location.href = '/';
      return;
    }

    const categories = await getCategories();
    const products = await getProducts();
    const orders = await getOrders();

    const activeCategories = categories.filter(c => true);
    const activeProducts = products.filter(p => p.disponible);
    const totalOrders = orders.length;

    this.container.innerHTML = `
      <div class="admin-container">
        <aside class="admin-sidebar">
          <h2>🍔 Food Store</h2>
          <ul>
            <li><a href="/admin" class="active">📊 Dashboard</a></li>
            <li><a href="/admin/categories">📁 Categorías</a></li>
            <li><a href="/admin/products">📦 Productos</a></li>
            <li><a href="/admin/orders">🛒 Pedidos</a></li>
          </ul>
          <div class="logout-link">
            <a href="#" id="logout-link">🚪 Cerrar Sesión</a>
          </div>
        </aside>
        
        <main class="admin-main">
          <div class="admin-header">
            <h1>Dashboard</h1>
            <p>Bienvenido, ${session.nombre} ${session.apellido}</p>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Total Categorías</h3>
              <div class="stat-number">${activeCategories.length}</div>
            </div>
            <div class="stat-card">
              <h3>Total Productos</h3>
              <div class="stat-number">${products.length}</div>
            </div>
            <div class="stat-card">
              <h3>Productos Activos</h3>
              <div class="stat-number">${activeProducts.length}</div>
            </div>
            <div class="stat-card">
              <h3>Total Pedidos</h3>
              <div class="stat-number">${totalOrders}</div>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Pedidos Pendientes</h3>
              <div class="stat-number">${orders.filter(o => o.estado === 'PENDIENTE').length}</div>
            </div>
            <div class="stat-card">
              <h3>Pedidos en Preparación</h3>
              <div class="stat-number">${orders.filter(o => o.estado === 'EN_PREPARACION').length}</div>
            </div>
            <div class="stat-card">
              <h3>Pedidos Entregados</h3>
              <div class="stat-number">${orders.filter(o => o.estado === 'ENTREGADO').length}</div>
            </div>
            <div class="stat-card">
              <h3>Pedidos Cancelados</h3>
              <div class="stat-number">${orders.filter(o => o.estado === 'CANCELADO').length}</div>
            </div>
          </div>
        </main>
      </div>
    `;

    const logoutLink = document.getElementById('logout-link');
    logoutLink?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('food_store_session');
      window.location.href = '/';
    });
  }
}