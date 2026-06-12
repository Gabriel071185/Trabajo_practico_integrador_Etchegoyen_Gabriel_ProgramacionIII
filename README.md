markdown
# 🍔 Food Store - Sistema de Gestión de Pedidos de Comida

Trabajo Práctico Integrador - Programación III

---

## 📋 Descripción del Proyecto

Food Store es un sistema de gestión de pedidos de comida que consta de dos partes independientes:

- **Frontend:** Aplicación web desarrollada con TypeScript, Vite y CSS, que simula un ecommerce con autenticación basada en localStorage y datos desde archivos JSON.

- **Backend:** Aplicación de consola desarrollada en Java con JPA/Hibernate y base de datos H2, que permite gestionar categorías, productos, usuarios y pedidos con persistencia real.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- TypeScript
- Vite
- HTML5 / CSS3
- LocalStorage (autenticación y carrito)

### Backend
- Java 21
- JPA / Hibernate 6.4.4
- H2 Database (modo archivo)
- Gradle
- Lombok

---

## 📁 Estructura del Proyecto

```text
Food Store - Sistema de gestión de pedidos de comida/
│
├── README.md
│
├── data/
│   └── jpa_db.mv.db
│
├── back_end/
│   └── food_store/
│       ├── build.gradle
│       ├── gradlew
│       ├── gradlew.bat
│       ├── settings.gradle
│       │
│       ├── src/main/
│       │   ├── java/com/tp/jpa/
│       │   │   ├── Main.java
│       │   │   ├── model/
│       │   │   │   ├── Base.java
│       │   │   │   ├── Calculable.java
│       │   │   │   ├── Categoria.java
│       │   │   │   ├── DetallePedido.java
│       │   │   │   ├── Pedido.java
│       │   │   │   ├── Producto.java
│       │   │   │   ├── Usuario.java
│       │   │   │   └── enums/
│       │   │   │       ├── EstadoPedido.java
│       │   │   │       ├── FormaPago.java
│       │   │   │       └── Rol.java
│       │   │   ├── repository/
│       │   │   │   ├── BaseRepository.java
│       │   │   │   ├── CategoriaRepository.java
│       │   │   │   ├── PedidoRepository.java
│       │   │   │   ├── ProductoRepository.java
│       │   │   │   └── UsuarioRepository.java
│       │   │   └── util/
│       │   │       └── JPAUtil.java
│       │   │
│       │   └── resources/META-INF/
│       │       └── persistence.xml
│       │
│       └── data/
│           └── jpa_db.mv.db
│
└── front_end/
    └── final-prog3/
        ├── index.html
        ├── package.json
        ├── tsconfig.json
        │
        ├── public/data/
        │   ├── categorias.json
        │   ├── pedidos.json
        │   ├── productos.json
        │   └── usuarios.json
        │
        └── src/
            ├── main.ts
            ├── assets/styles/
            │   ├── admin.css
            │   ├── cart.css
            │   ├── home.css
            │   ├── login.css
            │   ├── orders.css
            │   └── productDetail.css
            ├── pages/
            │   ├── admin/
            │   │   ├── adminHome/index.ts
            │   │   ├── categories/index.ts
            │   │   ├── orders/index.ts
            │   │   └── products/index.ts
            │   ├── auth/login/index.ts
            │   ├── client/orders/index.ts
            │   └── store/
            │       ├── cart/index.ts
            │       ├── home/index.ts
            │       └── productDetail/index.ts
            ├── types/
            │   ├── CartItem.ts
            │   ├── Category.ts
            │   ├── Order.ts
            │   ├── Product.ts
            │   ├── User.ts
            │   └── index.ts
            └── utils/
                ├── api.ts
                └── auth.ts

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- **Node.js** (v18 o superior)
- **Java JDK 21** o superior
- **Git** (opcional)

---

### Frontend

1. Abrir una terminal en la carpeta del frontend:

```bash
cd "Food Store - Sistema de gestión de pedidos de comida/front_end/final-prog3"
Instalar dependencias:

bash
npm install
Ejecutar el servidor de desarrollo:

bash
npm run dev
Abrir el navegador en: http://localhost:5173

Credenciales de prueba:
Rol	Email	Contraseña
ADMIN	admin@admin.com	123456
USUARIO	cliente@food.com	cliente123
Backend
Abrir una terminal en la carpeta del backend:

bash
cd "Food Store - Sistema de gestión de pedidos de comida/back_end/food_store"
Ejecutar la aplicación:

En Linux/Mac:

bash
./gradlew run
En Windows:

bash
gradlew.bat run
Navegar por el menú de consola:

text
===== FOOD STORE - MENÚ PRINCIPAL =====
1. Gestionar Categorías
2. Gestionar Productos
3. Gestionar Usuarios
4. Gestionar Pedidos
5. Reportes
0. Salir
Orden recomendado de uso:
Crear Categorías

Crear Productos (asociados a categorías)

Crear Usuarios

Crear Pedidos (asociados a usuarios y productos)

📊 Funcionalidades
Frontend (Cliente)
✅ Login / Logout

✅ Catálogo de productos (grid)

✅ Filtrado por categorías

✅ Búsqueda en tiempo real

✅ Detalle de producto

✅ Carrito de compras (localStorage)

✅ Mis Pedidos (historial)

✅ Panel de Administración (CRUD de categorías, productos y pedidos)

Backend (Consola)
✅ ABM de Categorías (Alta, Baja lógica, Modificación, Listado)

✅ ABM de Productos (con asociación a categoría)

✅ ABM de Usuarios (con búsqueda por mail)

✅ ABM de Pedidos (con validación de stock y transacción atómica)

✅ Cambio de estado de pedidos

✅ Reportes:

Productos por categoría

Pedidos por usuario

Pedidos por estado

Total facturado

🎨 Paleta de Colores y Tipografía
Elemento	Valor
Verde oscuro primario	#1a3c2e
Verde medio	#2d6a4f / #40916c
Dorado (acentos)	#b5985a
Tipografía principal	DM Sans
Tipografía títulos	DM Serif Display

📹 Video Demostrativo
Enlace al video demostrativo

El video muestra:

Flujo completo del cliente (login, navegación, carrito, confirmación de pedido)

Flujo completo del administrador (gestión de catálogo, actualización de estados de pedidos)


👨‍💻 Autor
Gabriel Etchegoyen

GitHub: @Gabriel071185

📅 Fecha de Entrega
Junio 2026

📚 Bibliografía
TypeScript Documentation

Vite Documentation

Hibernate ORM Documentation

H2 Database Documentation

Gradle Documentation

Jakarta Persistence (JPA) 3.1

Google Fonts - DM Sans

Google Fonts - DM Serif Display