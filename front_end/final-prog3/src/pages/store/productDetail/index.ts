import { getProductById } from '../../../utils/api';
import { getCurrentSession } from '../../../utils/auth';
import type { Product } from '../../../types';
import '../../../assets/styles/productDetail.css';

export class ProductDetailPage {
  private container: HTMLElement;
  private productId: number;
  private product: Product | null = null;
  private quantity: number = 1;

  constructor(container: HTMLElement, productId: number) {
    this.container = container;
    this.productId = productId;
  }

  async render(): Promise<void> {
    // Verificar autenticación
    const session = getCurrentSession();
    if (!session) {
      window.location.href = '/';
      return;
    }

    // Cargar producto
    await this.loadProduct();
    
    if (!this.product) {
      this.renderNotFound();
      return;
    }
    
    this.renderHTML();
    this.attachEvents();
  }

  private async loadProduct(): Promise<void> {
    const product = await getProductById(this.productId);
    this.product = product || null;
  }

  private renderNotFound(): void {
    this.container.innerHTML = `
      <div class="product-detail-container" style="text-align: center; padding: 80px;">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscás no existe o no está disponible.</p>
        <button id="back-button" class="btn-back" style="margin-top: 20px;">Volver a la tienda</button>
      </div>
    `;
    
    const backButton = document.getElementById('back-button');
    backButton?.addEventListener('click', () => {
      window.location.href = '/store';
    });
  }

  private renderHTML(): void {
    if (!this.product) return;
    
    const isAvailable = this.product.disponible && this.product.stock > 0;
    const maxStock = Math.min(this.product.stock, 99);
    
    this.container.innerHTML = `
      <div class="product-detail-container">
        <div class="product-detail-card">
          <div class="product-detail-image">
            <img src="${this.product.imagen}" alt="${this.product.nombre}" onerror="this.src='https://placehold.co/600x500?text=Food+Store'">
          </div>
          <div class="product-detail-info">
            <h1 class="product-detail-name">${this.product.nombre}</h1>
            <span class="product-detail-category">${this.product.categoria.nombre}</span>
            <p class="product-detail-description">${this.product.descripcion}</p>
            <div class="product-detail-price">$${this.product.precio.toLocaleString()}</div>
            <div class="product-detail-stock ${isAvailable ? 'available' : 'unavailable'}">
              ${isAvailable ? `✓ Stock disponible: ${this.product.stock} unidades` : '✗ Producto no disponible'}
            </div>
            
            ${isAvailable ? `
              <div class="quantity-selector">
                <label>Cantidad:</label>
                <input type="number" id="quantity-input" min="1" max="${maxStock}" value="${this.quantity}">
                <span>(máx. ${maxStock})</span>
              </div>
              
              <div class="button-group">
                <button id="add-to-cart-btn" class="btn-add-to-cart">🛒 Agregar al Carrito</button>
                <button id="back-button" class="btn-back">← Volver</button>
              </div>
            ` : `
              <div class="button-group">
                <button id="back-button" class="btn-back">← Volver</button>
              </div>
            `}
            
            <div id="message" style="display: none;"></div>
          </div>
        </div>
      </div>
    `;
  }

  private attachEvents(): void {
    // Botón volver
    const backButton = document.getElementById('back-button');
    backButton?.addEventListener('click', () => {
      window.location.href = '/store';
    });
    
    if (!this.product || !this.product.disponible || this.product.stock === 0) return;
    
    // Selector de cantidad
    const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
    if (quantityInput) {
      quantityInput.addEventListener('change', (e) => {
        let value = parseInt((e.target as HTMLInputElement).value);
        const max = parseInt(quantityInput.max);
        if (isNaN(value) || value < 1) value = 1;
        if (value > max) value = max;
        this.quantity = value;
        quantityInput.value = value.toString();
      });
    }
    
    // Botón agregar al carrito
    const addButton = document.getElementById('add-to-cart-btn');
    addButton?.addEventListener('click', () => {
      this.addToCart();
    });
  }
  
  private addToCart(): void {
    if (!this.product) return;
    
    // Obtener carrito actual
    const cartKey = 'food_store_cart';
    const existingCart = localStorage.getItem(cartKey);
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Verificar si el producto ya está en el carrito
    const existingIndex = cart.findIndex((item: { product: { id: number } }) => item.product.id === this.product!.id);
    
    if (existingIndex !== -1) {
      // Actualizar cantidad
      const newQuantity = cart[existingIndex].cantidad + this.quantity;
      if (newQuantity > this.product.stock) {
        this.showMessage(`No hay suficiente stock. Stock disponible: ${this.product.stock}`, 'error');
        return;
      }
      cart[existingIndex].cantidad = newQuantity;
      cart[existingIndex].subtotal = cart[existingIndex].cantidad * this.product.precio;
    } else {
      // Agregar nuevo producto
      cart.push({
        product: this.product,
        cantidad: this.quantity,
        subtotal: this.quantity * this.product.precio
      });
    }
    
    // Guardar en localStorage
    localStorage.setItem(cartKey, JSON.stringify(cart));
    
    // Mostrar mensaje de éxito
    this.showMessage(`✓ ${this.quantity}x ${this.product.nombre} agregado al carrito`, 'success');
    
    // Resetear cantidad a 1
    this.quantity = 1;
    const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
    if (quantityInput) {
      quantityInput.value = '1';
    }
  }
  
  private showMessage(message: string, type: 'success' | 'error'): void {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
      messageDiv.textContent = message;
      messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
      messageDiv.style.display = 'block';
      
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 3000);
    }
  }
}