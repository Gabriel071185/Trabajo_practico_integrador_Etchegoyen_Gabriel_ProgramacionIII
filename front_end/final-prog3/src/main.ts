import { LoginPage } from './pages/auth/login/index';
import { HomePage } from './pages/store/home/index';
import { ProductDetailPage } from './pages/store/productDetail/index';
import { CartPage } from './pages/store/cart/index';
import { OrdersPage } from './pages/client/orders/index';
import { AdminDashboardPage } from './pages/admin/adminHome/index';
import { AdminCategoriesPage } from './pages/admin/categories/index';
import { AdminProductsPage } from './pages/admin/products/index';

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
  } else if (path === '/cart' || path === '/cart/') {
    const cartPage = new CartPage(app);
    cartPage.render();
  } else if (path === '/orders' || path === '/orders/') {
    const ordersPage = new OrdersPage(app);
    ordersPage.render();
  } else if (path === '/admin' || path === '/admin/') {
    const adminPage = new AdminDashboardPage(app);
    adminPage.render();
  } else if (path === '/admin/categories' || path === '/admin/categories/') {
    const categoriesPage = new AdminCategoriesPage(app);
    categoriesPage.render();
  } else if (path === '/admin/products' || path === '/admin/products/') {
    const productsPage = new AdminProductsPage(app);
    productsPage.render();
  } else if (path === '/admin/orders' || path === '/admin/orders/') {
    // Temporal: mostrar dashboard hasta que creemos la página de pedidos
    const adminPage = new AdminDashboardPage(app);
    adminPage.render();
  } else if (path.startsWith('/product/')) {
    const productId = parseInt(path.split('/')[2]);
    if (!isNaN(productId)) {
      const productDetailPage = new ProductDetailPage(app, productId);
      productDetailPage.render();
    } else {
      window.location.href = '/store';
    }
  } else {
    const loginPage = new LoginPage(app);
    loginPage.render();
  }
}

document.addEventListener('DOMContentLoaded', init);