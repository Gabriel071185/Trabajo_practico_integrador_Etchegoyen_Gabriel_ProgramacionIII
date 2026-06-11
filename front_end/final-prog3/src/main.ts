import { LoginPage } from './pages/auth/login/index';
import { HomePage } from './pages/store/home/index';
import { ProductDetailPage } from './pages/store/productDetail/index';

function init() {
  const app = document.querySelector<HTMLDivElement>('#app');
  
  if (!app) return;
  
  const path = window.location.pathname;
  
  if (path === '/' || path === '/login') {
    const loginPage = new LoginPage(app);
    loginPage.render();
  } else if (path === '/store' || path === '/store/') {
    const homePage = new HomePage(app);
    homePage.render();
  } else if (path.startsWith('/product/')) {
    // Extraer el ID del producto de la URL
    const productId = parseInt(path.split('/')[2]);
    if (!isNaN(productId)) {
      const productDetailPage = new ProductDetailPage(app, productId);
      productDetailPage.render();
    } else {
      // ID inválido, redirigir a la tienda
      window.location.href = '/store';
    }
  } else {
    const loginPage = new LoginPage(app);
    loginPage.render();
  }
}

document.addEventListener('DOMContentLoaded', init);