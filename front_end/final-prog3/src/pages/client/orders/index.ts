import { getOrdersByUserId } from '../../../utils/api';
import { getCurrentSession } from '../../../utils/auth';
import type { Order, EstadoPedido } from '../../../types';
import '../../../assets/styles/orders.css';

export class OrdersPage {
  private container: HTMLElement;
  private orders: Order[] = [];
  

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    const session = getCurrentSession();
    if (!session) {
      window.location.href = '/';
      return;
    }

    if (session.rol === 'ADMIN') {
      window.location.href = '/admin';
      return;
    }

    await this.loadOrders();
    this.renderHTML();
    this.attachEvents();
  }

  private async loadOrders(): Promise<void> {
    const session = getCurrentSession();
    if (session) {
      this.orders = await getOrdersByUserId(session.id);
      this.orders.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }
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

  private renderHTML(): void {
    if (this.orders.length === 0) {
      this.container.innerHTML = `
        <div class="orders-container">
          <div class="orders-card">
            <div class="orders-header">
              <h1>📋 Mis Pedidos</h1>
              <button id="back-to-store-btn" class="btn-back-to-store">← Volver a la tienda</button>
            </div>
            <div class="empty-orders">
              <p>📦 No tenés pedidos realizados</p>
              <button id="go-to-store-empty-btn" class="btn-back-to-store">Ir a comprar</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="orders-container">
        <div class="orders-card">
          <div class="orders-header">
            <h1>📋 Mis Pedidos (${this.orders.length})</h1>
            <button id="back-to-store-btn" class="btn-back-to-store">← Volver a la tienda</button>
          </div>
          
          <div class="orders-list">
            ${this.orders.map(order => `
              <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                  <span class="order-id">Pedido #${order.id}</span>
                  <span class="order-date">${new Date(order.fecha).toLocaleDateString('es-AR')}</span>
                  <span class="order-status status-${order.estado}">${this.getStatusText(order.estado)}</span>
                  <span class="order-total">$${order.total.toLocaleString()}</span>
                </div>
                <div class="order-products-preview">
                  ${order.detalles.slice(0, 3).map(d => `${d.cantidad}x ${d.producto.nombre}`).join(' • ')}
                  ${order.detalles.length > 3 ? ` • +${order.detalles.length - 3} más` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <div id="order-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title">Detalle del Pedido</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div id="modal-body"></div>
        </div>
      </div>
    `;
  }

  private showOrderDetail(order: Order): void {
    const modal = document.getElementById('order-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
      <div class="modal-section">
        <h3>Información</h3>
        <p><strong>Pedido #${order.id}</strong></p>
        <p>Fecha: ${new Date(order.fecha).toLocaleDateString('es-AR')}</p>
        <p>Estado: <span class="order-status status-${order.estado}">${this.getStatusText(order.estado)}</span></p>
        <p>Forma de pago: ${order.formaPago}</p>
      </div>
      
      <div class="modal-section">
        <h3>Productos</h3>
        ${order.detalles.map(d => `
          <div class="detalle-item">
            <span class="detalle-item-name">${d.cantidad}x ${d.producto.nombre}</span>
            <span class="detalle-item-price">$${d.subtotal.toLocaleString()}</span>
          </div>
        `).join('')}
        <div class="detalle-item" style="font-weight: bold; border-top: 2px solid #e0e0e0; margin-top: 8px; padding-top: 8px;">
          <span>Total</span>
          <span>$${order.total.toLocaleString()}</span>
        </div>
      </div>
    `;
    
    modal.classList.add('active');
  }

  private attachEvents(): void {
    const backBtn = document.getElementById('back-to-store-btn');
    backBtn?.addEventListener('click', () => {
      window.location.href = '/store';
    });
    
    const goToStoreBtn = document.getElementById('go-to-store-empty-btn');
    goToStoreBtn?.addEventListener('click', () => {
      window.location.href = '/store';
    });
    
    document.querySelectorAll('.order-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const orderId = parseInt((e.currentTarget as HTMLElement).getAttribute('data-order-id') || '0');
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          this.showOrderDetail(order);
        }
      });
    });
    
    const modal = document.getElementById('order-modal');
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
}