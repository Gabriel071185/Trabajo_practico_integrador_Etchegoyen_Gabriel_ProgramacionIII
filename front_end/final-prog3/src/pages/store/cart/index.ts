import { getCurrentSession } from '../../../utils/auth';
import type { CartItem } from '../../../types';
import '../../../assets/styles/cart.css';

export class CartPage {
  private container: HTMLElement;
  private cartItems: CartItem[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    // Verificar autenticación
    const session = getCurrentSession();
    if (!session) {
      window.location.href = '/';
      return;
    }

    this.loadCart();
    this.renderHTML();
    this.attachEvents();
  }

  private loadCart(): void {
    const cartKey = 'food_store_cart';
    const existingCart = localStorage.getItem(cartKey);
    this.cartItems = existingCart ? JSON.parse(existingCart) : [];
  }

  private saveCart(): void {
    localStorage.setItem('food_store_cart', JSON.stringify(this.cartItems));
  }

  private renderHTML(): void {
    const subtotal = this.calculateSubtotal();
    const total = subtotal;
    const itemCount = this.cartItems.reduce((sum, item) => sum + item.cantidad, 0);

    if (this.cartItems.length === 0) {
      this.container.innerHTML = `
        <div class="cart-container">
          <div class="cart-card">
            <div class="empty-cart">
              <p>🛒 Tu carrito está vacío</p>
              <button id="go-to-store-btn" class="btn-go-to-store">Ir a la tienda</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="cart-container">
        <div class="cart-card">
          <div class="cart-header">
            <h1>🛒 Carrito de Compras (${itemCount} productos)</h1>
            <div class="cart-header-buttons">
              <button id="clear-cart-btn" class="btn-clear-cart">Vaciar Carrito</button>
              <button id="continue-shopping-btn" class="btn-continue-shopping">← Seguir comprando</button>
            </div>
          </div>
          
          <table class="cart-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this.cartItems.map((item, index) => `
                <tr data-index="${index}">
                  <td>
                    <div class="cart-product-cell">
                      <img class="cart-product-image" src="${item.product.imagen}" alt="${item.product.nombre}" onerror="this.src='https://placehold.co/60x60?text=Food'">
                      <span class="cart-product-name">${item.product.nombre}</span>
                    </div>
                  </td>
                  <td class="cart-product-price">$${item.product.precio.toLocaleString()}</td>
                  <td>
                    <div class="quantity-controls">
                      <button class="qty-minus" data-index="${index}">-</button>
                      <span>${item.cantidad}</span>
                      <button class="qty-plus" data-index="${index}">+</button>
                    </div>
                  </td>
                  <td class="cart-item-subtotal">$${item.subtotal.toLocaleString()}</td>
                  <td>
                    <button class="btn-remove" data-index="${index}">✗</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="cart-summary">
            <div class="summary-content">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toLocaleString()}</span>
              </div>
              <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toLocaleString()}</span>
              </div>
              <button id="checkout-btn" class="btn-checkout">Confirmar Pedido</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private calculateSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  private attachEvents(): void {
    // Botón vaciar carrito
    const clearBtn = document.getElementById('clear-cart-btn');
    clearBtn?.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
        this.cartItems = [];
        this.saveCart();
        this.renderHTML();
        this.attachEvents();
      }
    });

    // Botón seguir comprando
    const continueBtn = document.getElementById('continue-shopping-btn');
    continueBtn?.addEventListener('click', () => {
      window.location.href = '/store';
    });

    // Botón ir a tienda (carrito vacío)
    const goToStoreBtn = document.getElementById('go-to-store-btn');
    goToStoreBtn?.addEventListener('click', () => {
      window.location.href = '/store';
    });

    // Botones de cantidad (- y +)
    document.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
        this.updateQuantity(index, -1);
      });
    });

    document.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
        this.updateQuantity(index, 1);
      });
    });

    // Botones eliminar
    document.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).getAttribute('data-index') || '0');
        this.removeItem(index);
      });
    });

    // Botón confirmar pedido
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn?.addEventListener('click', () => {
      this.checkout();
    });
  }

  private updateQuantity(index: number, change: number): void {
    const item = this.cartItems[index];
    if (!item) return;

    const newQuantity = item.cantidad + change;
    
    if (newQuantity < 1) {
      this.removeItem(index);
      return;
    }
    
    if (newQuantity > item.product.stock) {
      alert(`No hay suficiente stock. Stock disponible: ${item.product.stock}`);
      return;
    }
    
    item.cantidad = newQuantity;
    item.subtotal = item.cantidad * item.product.precio;
    this.saveCart();
    this.renderHTML();
    this.attachEvents();
  }

  private removeItem(index: number): void {
    this.cartItems.splice(index, 1);
    this.saveCart();
    this.renderHTML();
    this.attachEvents();
  }

  private checkout(): void {
    if (this.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    if (confirm('¿Confirmar pedido? Se generará tu orden de compra.')) {
      // TODO: Guardar el pedido en pedidos.json (simulado)
      alert('✅ Pedido confirmado con éxito');
      this.cartItems = [];
      this.saveCart();
      this.renderHTML();
      this.attachEvents();
    }
  }
}