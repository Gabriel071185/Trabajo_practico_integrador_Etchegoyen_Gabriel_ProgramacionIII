import { login, getRedirectPathByRole } from '../../../utils/auth';
import '../../../assets/styles/login.css';

export class LoginPage {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(): void {
    this.container.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <h1>🍔 Food Store</h1>
          <h2>Iniciar Sesión</h2>
          
          <form id="login-form">
            <div>
              <label>Email</label>
              <input type="email" id="email" placeholder="admin@admin.com" required>
            </div>
            
            <div>
              <label>Contraseña</label>
              <input type="password" id="password" placeholder="••••••" required>
            </div>
            
            <div id="error-message" style="color: red; display: none;"></div>
            
            <button type="submit">Ingresar</button>
          </form>
          
          <div>
            <p><strong>Usuarios de prueba:</strong></p>
            <p>👑 Admin: admin@admin.com / 123456</p>
            <p>👤 Usuario: cliente@food.com / cliente123</p>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('login-form');
    form?.addEventListener('submit', this.handleSubmit.bind(this));
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const errorDiv = document.getElementById('error-message');
    
    if (!email || !password) {
      if (errorDiv) {
        errorDiv.textContent = 'Complete todos los campos';
        errorDiv.style.display = 'block';
      }
      return;
    }
    
    const session = await login(email, password);
    
    if (session) {
      const redirectPath = getRedirectPathByRole(session.rol);
      window.location.href = redirectPath;
    } else {
      if (errorDiv) {
        errorDiv.textContent = 'Email o contraseña incorrectos';
        errorDiv.style.display = 'block';
      }
    }
  }
}