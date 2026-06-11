import { getCurrentSession } from '../../../utils/auth';
import { getProducts, getCategories } from '../../../utils/api';
import type { Product, Category } from '../../../types';
import '../../../assets/styles/admin.css';

export class AdminProductsPage {
  private container: HTMLElement;
  private products: Product[] = [];
  private categories: Category[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  async render(): Promise<void> {
    const session = getCurrentSession();
    if (!session || session.rol !== 'ADMIN') {
      window.location.href = '/';
      return;
    }

    await this.loadData();
    this.renderHTML();
    this.attachEvents();
  }

  private async loadData(): Promise<void> {
    this.products = await getProducts();
    this.categories = await getCategories();
  }

  private renderHTML(): void {
    this.container.innerHTML = `
      <div class="admin-container">
        <aside class="admin-sidebar">
          <h2>🍔 Food Store</h2>
          <ul>
            <li><a href="/admin">📊 Dashboard</a></li>
            <li><a href="/admin/categories">📁 Categorías</a></li>
            <li><a href="/admin/products" class="active">📦 Productos</a></li>
            <li><a href="/admin/orders">🛒 Pedidos</a></li>
          </ul>
          <div class="logout-link">
            <a href="#" id="logout-link">🚪 Cerrar Sesión</a>
          </div>
        </aside>
        
        <main class="admin-main">
          <div class="admin-header">
            <h1>Gestión de Productos</h1>
            <button id="add-product-btn" class="btn-add">+ Nuevo Producto</button>
          </div>
          
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.products.map(product => `
                <tr data-id="${product.id}">
                  <td>${product.id}</td>
                  <td><img src="${product.imagen}" alt="${product.nombre}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;"></td>
                  <td>${product.nombre}</td>
                  <td>$${product.precio.toLocaleString()}</td>
                  <td>${product.stock}</td>
                  <td>${product.categoria.nombre}</td>
                  <td>${product.disponible ? '✅ Activo' : '❌ Inactivo'}</td>
                  <td>
                    <button class="btn-edit" data-id="${product.id}">✏️ Editar</button>
                    <button class="btn-delete" data-id="${product.id}">🗑️ Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </main>
      </div>
      
      <!-- Modal para agregar/editar -->
      <div id="product-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title">Nuevo Producto</h2>
            <button class="modal-close">&times;</button>
          </div>
          <form id="product-form">
            <input type="hidden" id="product-id">
            <div class="form-group">
              <label>Nombre *</label>
              <input type="text" id="product-name" required>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea id="product-description" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label>Precio *</label>
              <input type="number" id="product-price" step="0.01" required>
            </div>
            <div class="form-group">
              <label>Stock *</label>
              <input type="number" id="product-stock" required>
            </div>
            <div class="form-group">
              <label>Imagen (URL)</label>
              <input type="text" id="product-image" placeholder="https://...">
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select id="product-category" required>
                <option value="">Seleccionar categoría</option>
                ${this.categories.map(cat => `
                  <option value="${cat.id}">${cat.nombre}</option>
                `).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Disponible</label>
              <select id="product-available">
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">Guardar</button>
          </form>
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

    // Botón agregar
    const addBtn = document.getElementById('add-product-btn');
    addBtn?.addEventListener('click', () => {
      this.openModal();
    });

    // Botones editar
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id') || '0');
        this.openModal(id);
      });
    });

    // Botones eliminar
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt((e.currentTarget as HTMLElement).getAttribute('data-id') || '0');
        this.deleteProduct(id);
      });
    });

    // Modal - cerrar
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => {
      modal?.classList.remove('active');
    });
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Formulario
    const form = document.getElementById('product-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveProduct();
    });
  }

  private openModal(id?: number): void {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const idInput = document.getElementById('product-id') as HTMLInputElement;
    const nameInput = document.getElementById('product-name') as HTMLInputElement;
    const descInput = document.getElementById('product-description') as HTMLTextAreaElement;
    const priceInput = document.getElementById('product-price') as HTMLInputElement;
    const stockInput = document.getElementById('product-stock') as HTMLInputElement;
    const imageInput = document.getElementById('product-image') as HTMLInputElement;
    const categorySelect = document.getElementById('product-category') as HTMLSelectElement;
    const availableSelect = document.getElementById('product-available') as HTMLSelectElement;

    if (id) {
      const product = this.products.find(p => p.id === id);
      if (product) {
        title!.textContent = 'Editar Producto';
        idInput.value = product.id.toString();
        nameInput.value = product.nombre;
        descInput.value = product.descripcion || '';
        priceInput.value = product.precio.toString();
        stockInput.value = product.stock.toString();
        imageInput.value = product.imagen || '';
        categorySelect.value = product.categoria.id.toString();
        availableSelect.value = product.disponible ? 'true' : 'false';
      }
    } else {
      title!.textContent = 'Nuevo Producto';
      idInput.value = '';
      nameInput.value = '';
      descInput.value = '';
      priceInput.value = '';
      stockInput.value = '';
      imageInput.value = '';
      categorySelect.value = '';
      availableSelect.value = 'true';
    }

    modal?.classList.add('active');
  }

  private saveProduct(): void {
    const idInput = document.getElementById('product-id') as HTMLInputElement;
    const nameInput = document.getElementById('product-name') as HTMLInputElement;
    const descInput = document.getElementById('product-description') as HTMLTextAreaElement;
    const priceInput = document.getElementById('product-price') as HTMLInputElement;
    const stockInput = document.getElementById('product-stock') as HTMLInputElement;
    const imageInput = document.getElementById('product-image') as HTMLInputElement;
    const categorySelect = document.getElementById('product-category') as HTMLSelectElement;
    const availableSelect = document.getElementById('product-available') as HTMLSelectElement;

    if (!nameInput.value.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
      alert('El precio debe ser mayor a 0');
      return;
    }

    if (!stockInput.value || parseInt(stockInput.value) < 0) {
      alert('El stock no puede ser negativo');
      return;
    }

    const categoryId = parseInt(categorySelect.value);
    const category = this.categories.find(c => c.id === categoryId);

    if (!category) {
      alert('Seleccioná una categoría');
      return;
    }

    const newProduct: Product = {
      id: idInput.value ? parseInt(idInput.value) : Date.now(),
      nombre: nameInput.value.trim(),
      descripcion: descInput.value.trim(),
      precio: parseFloat(priceInput.value),
      stock: parseInt(stockInput.value),
      imagen: imageInput.value.trim() || 'https://placehold.co/300x200?text=Food+Store',
      disponible: availableSelect.value === 'true',
      categoria: category
    };

    if (idInput.value) {
      // Editar
      const index = this.products.findIndex(p => p.id === newProduct.id);
      if (index !== -1) {
        this.products[index] = newProduct;
      }
    } else {
      // Agregar
      this.products.push(newProduct);
    }

    // Guardar en localStorage (simulado, después va a API)
    localStorage.setItem('food_store_products', JSON.stringify(this.products));
    
    // Cerrar modal y recargar
    const modal = document.getElementById('product-modal');
    modal?.classList.remove('active');
    this.renderHTML();
    this.attachEvents();
  }

  private deleteProduct(id: number): void {
    if (confirm('¿Eliminar este producto?')) {
      this.products = this.products.filter(p => p.id !== id);
      localStorage.setItem('food_store_products', JSON.stringify(this.products));
      this.renderHTML();
      this.attachEvents();
    }
  }
}