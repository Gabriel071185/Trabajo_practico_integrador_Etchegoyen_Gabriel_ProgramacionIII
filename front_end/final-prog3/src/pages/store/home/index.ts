import { getProducts, getCategories } from '../../../utils/api';
import { getCurrentSession } from '../../../utils/auth';
import type { Product, Category } from '../../../types';
import '../../../assets/styles/home.css';

export class HomePage {
  private container: HTMLElement;
  private products: Product[] = [];
  private categories: Category[] = [];
  private selectedCategory: number | null = null;
  private searchTerm: string = '';
  private cartCount: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    // Verificar autenticación
    const session = getCurrentSession();
    if (!session) {
      window.location.href = '/';
      return;
    }

    // Cargar datos
    await this.loadData();
    
    // Renderizar
    this.renderHTML();
    this.attachEvents();
  }

  private async loadData(): Promise<void> {
    this.products = await getProducts();
    this.categories = await getCategories();
    this.loadCartCount();
  }

  private loadCartCount(): void {
    const cart = localStorage.getItem('food_store_cart');
    if (cart) {
      const items = JSON.parse(cart);
      this.cartCount = items.reduce((sum: number, item: any) => sum + item.cantidad, 0);
    }
  }

  private renderHTML(): void {
    const filteredProducts = this.getFilteredProducts();
    
    this.container.innerHTML = `
      <div class="home-container">
        <aside class="home-sidebar">
          <h3>Categorías</h3>
          <ul>
            <li class="${this.selectedCategory === null ? 'active-category' : ''}" data-category="all">
              Todos los productos
            </li>
            ${this.categories.map(cat => `
              <li data-category="${cat.id}" class="${this.selectedCategory === cat.id ? 'active-category' : ''}">
                ${cat.nombre}
              </li>
            `).join('')}
          </ul>
        </aside>
        
        <main class="home-main">
          <div class="home-header">
            <h1>🍔 Food Store</h1>
            <div class="search-box">
              <input type="text" id="search-input" placeholder="Buscar productos..." value="${this.searchTerm}">
            </div>
            <div class="cart-badge" id="cart-button">
              <span class="cart-icon">🛒</span>
              ${this.cartCount > 0 ? `<span class="cart-count">${this.cartCount}</span>` : ''}
            </div>
          </div>
          
          <div class="results-count">
            Mostrando ${filteredProducts.length} de ${this.products.length} productos
          </div>
          
          <div class="products-grid" id="products-grid">
            ${filteredProducts.length === 0 ? `
              <div class="empty-results">
                <p>No se encontraron productos</p>
                <p>Probá con otra búsqueda o categoría</p>
              </div>
            ` : filteredProducts.map(product => `
              <div class="product-card" data-product-id="${product.id}">
                <img class="product-image" src="${product.imagen}" alt="${product.nombre}" onerror="this.src='https://placehold.co/300x200?text=Food+Store'">
                <div class="product-info">
                  <div class="product-name">${product.nombre}</div>
                  <div class="product-description">${product.descripcion.substring(0, 80)}...</div>
                  <div class="product-price">$${product.precio.toLocaleString()}</div>
                  <div class="product-stock ${product.stock > 0 && product.disponible ? 'available' : 'unavailable'}">
                    ${product.stock > 0 && product.disponible ? `✓ Stock: ${product.stock}` : '✗ No disponible'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </main>
      </div>
    `;
  }

  private getFilteredProducts(): Product[] {
    let filtered = this.products.filter(p => p.disponible);
    
    // Filtrar por categoría
    if (this.selectedCategory !== null) {
      filtered = filtered.filter(p => p.categoria.id === this.selectedCategory);
    }
    
    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(term) || 
        p.descripcion.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }

  private attachEvents(): void {
    // Eventos de categorías
    document.querySelectorAll('[data-category]').forEach(el => {
      el.addEventListener('click', (e) => {
        const categoryId = (e.currentTarget as HTMLElement).getAttribute('data-category');
        if (categoryId === 'all') {
          this.selectedCategory = null;
        } else {
          this.selectedCategory = parseInt(categoryId!);
        }
        this.render();
      });
    });
    
    // Evento de búsqueda
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = (e.target as HTMLInputElement).value;
        this.render();
      });
    }
    
    // Evento de productos (click para ir a detalle)
    document.querySelectorAll('.product-card').forEach(el => {
      el.addEventListener('click', (e) => {
        const productId = (e.currentTarget as HTMLElement).getAttribute('data-product-id');
        if (productId) {
          window.location.href = `/product/${productId}`;
        }
      });
    });
    
    // Evento del carrito
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
      cartButton.addEventListener('click', () => {
        window.location.href = '/cart';
      });
    }
  }
}