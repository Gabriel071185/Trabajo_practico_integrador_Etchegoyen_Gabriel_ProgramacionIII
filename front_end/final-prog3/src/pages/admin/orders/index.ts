import { getCurrentSession } from '../../../utils/auth';
import { getOrders } from '../../../utils/api';
import type { Order, EstadoPedido } from '../../../types';
import '../../../assets/styles/admin.css';

export class AdminOrdersPage {
  private container: HTMLElement;
  private orders: Order[] = [];
  private filterEstado: string = 'todos';

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    const session = getCurrentSession();
    if (!session || session.rol !== 'ADMIN') {
      window.location.href = '/';
      return;
    }

    await this.loadOrders();
    this.renderHTML();
    this.attachEvents();
  }

  private async loadOrders(): Promise<void> {
    this.orders = await getOrders();
    // Ordenar por fecha más reciente primero
    this.orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  private getStatusText(estado: EstadoPedido): string {
    const statusMap: Record<EstadoPedido, string> = {
      'PENDIENTE': 'Pendiente',
      'EN_PREPARACION': 'En Preparación',
      'ENTREGADO': 'Entregado',
      'CANCELADO': 'Cancelado'
    };
    return statusMap[estado] || estado;
  }

  private getFilteredOrders(): Order[] {
    if (this.filterEstado === 'todos') {
      return this.orders;
    }
    return this.orders.filter(o => o.estado === this.filterEstado);
  }

  private renderHTML(): void {
    const filteredOrders = this.getFilteredOrders();

    this.container.innerHTML = `
      <div class="admin-container">
        <aside class="admin-sidebar">
          <h2>🍔 Food Store</h2>
          <ul>
            <li><a href="/admin">📊 Dashboard</a></li>
            <li><a href="/admin/categories">📁 Categorías</a></li>
            <li><a href="/admin/products">📦 Productos</a></li>
            <li><a href="/admin/orders" class="active">🛒 Pedidos</a></li>
          </ul>
          <div class="logout-link">
            <a href="#" id="logout-link">🚪 Cerrar Sesión</a>
          </div>
        </aside>
        
        <main class="admin-main">
          <div class="admin-header">
            <h1>Gestión de Pedidos</h1>
            <div style="margin-top: 16px;">
              <label>Filtrar por estado: </label>
              <select id="filter-estado">
                <option value="todos" ${this.filterEstado === 'todos' ? 'selected' : ''}>Todos</option>
                <option value="PENDIENTE" ${this.filterEstado === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
                <option value="EN_PREPARACION" ${this.filterEstado === 'EN_PREPARACION' ? 'selected' : ''}>En Preparación</option>
                <option value="ENTREGADO" ${this.filterEstado === 'ENTREGADO' ? 'selected' : ''}>Entregado</option>
                <option value="CANCELADO" ${this.filterEstado === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
              </select>
            </div>
          </div>
          
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${filteredOrders.map(order => `
                <tr data-id="${order.id}">
                  <td>${order.id}</td>
                  <td>${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</td>
                  <td>${new Date(order.fecha).toLocaleDateString('es-AR')}</td>
                  <td>${order.detalles.reduce((sum, d) => sum + d.cantidad, 0)} productos</td>
                  <td>$${order.total.toLocaleString()}</td>
                  <td>
                    <select class="estado-select" data-id="${order.id}" data-estado="${order.estado}">
                      <option value="PENDIENTE" ${order.estado === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
                      <option value="EN_PREPARACION" ${order.estado === 'EN_PREPARACION' ? 'selected' : ''}>En Preparación</option>
                      <option value="ENTREGADO" ${order.estado === 'ENTREGADO' ? 'selected' : ''}>Entregado</option>
                      <option value="CANCELADO" ${order.estado === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button class="btn-view" data-id="${order.id}">👁️ Ver Detalle</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </main>
      </div>
      
      <!-- Modal para detalle del pedido -->
      <div id="order-detail-modal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
          <div class="modal-header">
            <h2>Detalle del Pedido</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div id="order-detail-body"></div>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    // Cerrar sesión
    const logoutLink = document.getElementById('logout-link');
    logoutLink?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('food_store_session');
      window.location.href = '/';
    });

    // Filtro
    const filterSelect = document.getElementById('filter-estado') as HTMLSelectElement;
    filterSelect?.addEventListener('change', (e) => {
      this.filterEstado = (e.target as HTMLSelectElement).value;
      this.renderHTML();
      this.attachEvents();
    });

    // Cambiar estado
    document.querySelectorAll('.estado-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const orderId = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id') || '0');
        const newEstado = (e.target as HTMLSelectElement).value as EstadoPedido;
        this.updateOrderStatus(orderId, newEstado);
      });
    });

    // Ver detalle
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id') || '0');
        this.showOrderDetail(orderId);
      });
    });

    // Modal - cerrar
    const modal = document.getElementById('order-detail-modal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => {
      modal?.classList.remove('active');
    });
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  private updateOrderStatus(orderId: number, newEstado: EstadoPedido): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.estado = newEstado;
      // Guardar en localStorage (simulado)
      localStorage.setItem('food_store_orders', JSON.stringify(this.orders));
      this.renderHTML();
      this.attachEvents();
    }
  }

  private showOrderDetail(orderId: number): void {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.getElementById('order-detail-modal');
    const modalBody = document.getElementById('order-detail-body');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="margin-bottom: 20px;">
        <p><strong>Pedido #${order.id}</strong></p>
        <p><strong>Cliente:</strong> ${order.usuarioDto.nombre} ${order.usuarioDto.apellido}</p>
        <p><strong>Email:</strong> ${order.usuarioDto.mail}</p>
        <p><strong>Celular:</strong> ${order.usuarioDto.celular || '-'}</p>
        <p><strong>Fecha:</strong> ${new Date(order.fecha).toLocaleDateString('es-AR')}</p>
        <p><strong>Forma de pago:</strong> ${order.formaPago}</p>
        <p><strong>Estado:</strong> ${this.getStatusText(order.estado)}</p>
      </div>
      
      <h3 style="margin-bottom: 12px;">Productos:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f0f0f0;">
            <th style="padding: 8px; text-align: left;">Producto</th>
            <th style="padding: 8px; text-align: center;">Cantidad</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.detalles.map(d => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 8px;">${d.producto.nombre}</td>
              <td style="padding: 8px; text-align: center;">${d.cantidad}</td>
              <td style="padding: 8px; text-align: right;">$${d.subtotal.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold; background: #f8f9fa;">
            <td style="padding: 8px;" colspan="2">Total</td>
            <td style="padding: 8px; text-align: right;">$${order.total.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
    `;

    modal.classList.add('active');
  }
}