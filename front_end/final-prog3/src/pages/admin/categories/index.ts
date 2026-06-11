import { getCurrentSession } from '../../../utils/auth';
import { getCategories } from '../../../utils/api';
import type { Category } from '../../../types';
import '../../../assets/styles/admin.css';

export class AdminCategoriesPage {
  private container: HTMLElement;
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

    await this.loadCategories();
    this.renderHTML();
    this.attachEvents();
  }

  private async loadCategories(): Promise<void> {
    this.categories = await getCategories();
  }

  private renderHTML(): void {
    this.container.innerHTML = `
      <div class="admin-container">
        <aside class="admin-sidebar">
          <h2>🍔 Food Store</h2>
          <ul>
            <li><a href="/admin">📊 Dashboard</a></li>
            <li><a href="/admin/categories" class="active">📁 Categorías</a></li>
            <li><a href="/admin/products">📦 Productos</a></li>
            <li><a href="/admin/orders">🛒 Pedidos</a></li>
          </ul>
          <div class="logout-link">
            <a href="#" id="logout-link">🚪 Cerrar Sesión</a>
          </div>
        </aside>
        
        <main class="admin-main">
          <div class="admin-header">
            <h1>Gestión de Categorías</h1>
            <button id="add-category-btn" class="btn-add">+ Nueva Categoría</button>
          </div>
          
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${this.categories.map(cat => `
                <tr data-id="${cat.id}">
                  <td>${cat.id}</td>
                  <td>${cat.nombre}</td>
                  <td>${cat.descripcion || '-'}</td>
                  <td>
                    <button class="btn-edit" data-id="${cat.id}">✏️ Editar</button>
                    <button class="btn-delete" data-id="${cat.id}">🗑️ Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
           </table>
        </main>
      </div>
      
      <!-- Modal para agregar/editar -->
      <div id="category-modal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modal-title">Nueva Categoría</h2>
            <button class="modal-close">&times;</button>
          </div>
          <form id="category-form">
            <input type="hidden" id="category-id">
            <div class="form-group">
              <label>Nombre *</label>
              <input type="text" id="category-name" required>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea id="category-description" rows="3"></textarea>
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
    const addBtn = document.getElementById('add-category-btn');
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
        this.deleteCategory(id);
      });
    });

    // Modal - cerrar
    const modal = document.getElementById('category-modal');
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
    const form = document.getElementById('category-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveCategory();
    });
  }

  private openModal(id?: number): void {
    const modal = document.getElementById('category-modal');
    const title = document.getElementById('modal-title');
    const idInput = document.getElementById('category-id') as HTMLInputElement;
    const nameInput = document.getElementById('category-name') as HTMLInputElement;
    const descInput = document.getElementById('category-description') as HTMLTextAreaElement;

    if (id) {
      const category = this.categories.find(c => c.id === id);
      if (category) {
        title!.textContent = 'Editar Categoría';
        idInput.value = category.id.toString();
        nameInput.value = category.nombre;
        descInput.value = category.descripcion || '';
      }
    } else {
      title!.textContent = 'Nueva Categoría';
      idInput.value = '';
      nameInput.value = '';
      descInput.value = '';
    }

    modal?.classList.add('active');
  }

  private saveCategory(): void {
    const idInput = document.getElementById('category-id') as HTMLInputElement;
    const nameInput = document.getElementById('category-name') as HTMLInputElement;
    const descInput = document.getElementById('category-description') as HTMLTextAreaElement;

    if (!nameInput.value.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    const newCategory: Category = {
      id: idInput.value ? parseInt(idInput.value) : Date.now(),
      nombre: nameInput.value.trim(),
      descripcion: descInput.value.trim()
    };

    if (idInput.value) {
      // Editar
      const index = this.categories.findIndex(c => c.id === newCategory.id);
      if (index !== -1) {
        this.categories[index] = newCategory;
      }
    } else {
      // Agregar
      this.categories.push(newCategory);
    }

    // Guardar en localStorage (simulado, después va a API)
    localStorage.setItem('food_store_categories', JSON.stringify(this.categories));
    
    // Cerrar modal y recargar
    const modal = document.getElementById('category-modal');
    modal?.classList.remove('active');
    this.renderHTML();
    this.attachEvents();
  }

  private deleteCategory(id: number): void {
    if (confirm('¿Eliminar esta categoría?')) {
      this.categories = this.categories.filter(c => c.id !== id);
      localStorage.setItem('food_store_categories', JSON.stringify(this.categories));
      this.renderHTML();
      this.attachEvents();
    }
  }
}