package com.tp.jpa;

import com.tp.jpa.model.enums.EstadoPedido;
import com.tp.jpa.model.*;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.PedidoRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.repository.UsuarioRepository;
import com.tp.jpa.util.JPAUtil;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.EntityTransaction;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Scanner;

public class Main {

    private static final Scanner sc = new Scanner(System.in);

    private static final CategoriaRepository categoriaRepo = new CategoriaRepository();
    private static final ProductoRepository productoRepo = new ProductoRepository();
    private static final UsuarioRepository usuarioRepo = new UsuarioRepository();
    private static final PedidoRepository pedidoRepo = new PedidoRepository();

    public static void main(String[] args) {
        boolean salir = false;
        while (!salir) {
            System.out.println();
            System.out.println("===== FOOD STORE - MENÚ PRINCIPAL =====");
            System.out.println("1. Gestionar Categorías");
            System.out.println("2. Gestionar Productos");
            System.out.println("3. Gestionar Usuarios");
            System.out.println("4. Gestionar Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            if (op.isEmpty()) {
                System.out.println("Opción inválida.");
                continue;
            }
            switch (op) {
                case "1": menuCategorias(); break;
                case "2": menuProductos(); break;
                case "3": menuUsuarios(); break;
                case "4": menuPedidos(); break;
                case "5": menuReportes(); break;
                case "0": salir = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
        JPAUtil.close();
        System.out.println("Aplicación finalizada.");
    }

    // ==================== MÉTODO AUXILIAR PARA LEER ID ====================

    private static Long leerId(String mensaje) {
        System.out.print(mensaje);
        String input = sc.nextLine().trim();
        if (input.isEmpty()) {
            System.out.println("Operación cancelada.");
            return null;
        }
        try {
            return Long.parseLong(input);
        } catch (NumberFormatException e) {
            System.out.println("ID inválido. Debe ingresar un número.");
            return null;
        }
    }

    // ==================== SUBMENÚ CATEGORÍAS ====================

    private static void menuCategorias() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n--- GESTIÓN DE CATEGORÍAS ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            if (op.isEmpty()) {
                System.out.println("Opción inválida.");
                continue;
            }
            switch (op) {
                case "1": altaCategoria(); break;
                case "2": modificarCategoria(); break;
                case "3": bajaCategoria(); break;
                case "4": listarCategorias(); break;
                case "0": volver = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaCategoria() {
        System.out.print("Nombre: ");
        String nombre = sc.nextLine().trim();
        if (nombre.isEmpty()) {
            System.out.println("Error: el nombre es obligatorio.");
            return;
        }
        System.out.print("Descripción: ");
        String descripcion = sc.nextLine().trim();

        Categoria categoria = Categoria.builder()
                .nombre(nombre)
                .descripcion(descripcion.isEmpty() ? null : descripcion)
                .build();

        Categoria guardada = categoriaRepo.guardar(categoria);
        System.out.println("Categoría creada con ID: " + guardada.getId());
    }

    private static void modificarCategoria() {
        listarCategorias();
        Long id = leerId("ID de categoría a modificar: ");
        if (id == null) return;
        
        Optional<Categoria> opt = categoriaRepo.buscarPorId(id);
        if (opt.isEmpty()) {
            System.out.println("Categoría no encontrada.");
            return;
        }
        Categoria cat = opt.get();
        System.out.println("Valores actuales:");
        System.out.println("  Nombre: " + cat.getNombre());
        System.out.println("  Descripción: " + (cat.getDescripcion() == null ? "-" : cat.getDescripcion()));

        System.out.print("Nuevo nombre (Enter para mantener): ");
        String nombre = sc.nextLine().trim();
        if (!nombre.isEmpty()) cat.setNombre(nombre);

        System.out.print("Nueva descripción (Enter para mantener): ");
        String descripcion = sc.nextLine().trim();
        if (!descripcion.isEmpty()) cat.setDescripcion(descripcion);

        categoriaRepo.guardar(cat);
        System.out.println("Categoría actualizada.");
    }

    private static void bajaCategoria() {
        listarCategorias();
        Long id = leerId("ID de categoría a eliminar: ");
        if (id == null) return;
        
        boolean eliminado = categoriaRepo.eliminarLogico(id);
        if (eliminado) {
            System.out.println("Categoría eliminada (baja lógica).");
        } else {
            System.out.println("Categoría no encontrada o ya eliminada.");
        }
    }

    private static void listarCategorias() {
        List<Categoria> categorias = categoriaRepo.listarActivos();
        if (categorias.isEmpty()) {
            System.out.println("No hay categorías activas.");
            return;
        }
        System.out.println("\n--- CATEGORÍAS ACTIVAS ---");
        for (Categoria c : categorias) {
            System.out.println("ID: " + c.getId() + " | Nombre: " + c.getNombre() + " | Desc: " + (c.getDescripcion() == null ? "-" : c.getDescripcion()));
        }
    }

    // ==================== SUBMENÚ PRODUCTOS ====================

    private static void menuProductos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n--- GESTIÓN DE PRODUCTOS ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            if (op.isEmpty()) {
                System.out.println("Opción inválida.");
                continue;
            }
            switch (op) {
                case "1": altaProducto(); break;
                case "2": modificarProducto(); break;
                case "3": bajaProducto(); break;
                case "4": listarProductos(); break;
                case "0": volver = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaProducto() {
        listarCategorias();
        Long catId = leerId("ID de categoría: ");
        if (catId == null) return;
        
        Optional<Categoria> optCat = categoriaRepo.buscarPorId(catId);
        if (optCat.isEmpty()) {
            System.out.println("Categoría no encontrada.");
            return;
        }
        Categoria categoria = optCat.get();

        System.out.print("Nombre: ");
        String nombre = sc.nextLine().trim();
        if (nombre.isEmpty()) {
            System.out.println("Error: el nombre es obligatorio.");
            return;
        }

        System.out.print("Descripción: ");
        String descripcion = sc.nextLine().trim();

        System.out.print("Precio: ");
        String precioStr = sc.nextLine().trim();
        if (precioStr.isEmpty()) {
            System.out.println("Error: el precio es obligatorio.");
            return;
        }
        double precio;
        try {
            precio = Double.parseDouble(precioStr);
        } catch (NumberFormatException e) {
            System.out.println("Error: precio inválido.");
            return;
        }
        if (precio <= 0) {
            System.out.println("Error: el precio debe ser mayor a 0.");
            return;
        }

        System.out.print("Stock: ");
        String stockStr = sc.nextLine().trim();
        if (stockStr.isEmpty()) {
            System.out.println("Error: el stock es obligatorio.");
            return;
        }
        int stock;
        try {
            stock = Integer.parseInt(stockStr);
        } catch (NumberFormatException e) {
            System.out.println("Error: stock inválido.");
            return;
        }
        if (stock < 0) {
            System.out.println("Error: el stock no puede ser negativo.");
            return;
        }

        System.out.print("Imagen (URL, opcional): ");
        String imagen = sc.nextLine().trim();

        System.out.print("Disponible (S/N): ");
        String disp = sc.nextLine().trim().toUpperCase();
        boolean disponible = disp.equals("S");

        Producto producto = Producto.builder()
                .nombre(nombre)
                .descripcion(descripcion.isEmpty() ? null : descripcion)
                .precio(precio)
                .stock(stock)
                .imagen(imagen.isEmpty() ? null : imagen)
                .disponible(disponible)
                .categoria(categoria)
                .build();

        Producto guardado = productoRepo.guardar(producto);
        System.out.println("Producto creado con ID: " + guardado.getId() + " | Categoría: " + categoria.getNombre());
    }

    private static void modificarProducto() {
        listarProductos();
        Long id = leerId("ID de producto a modificar: ");
        if (id == null) return;
        
        Optional<Producto> opt = productoRepo.buscarPorId(id);
        if (opt.isEmpty()) {
            System.out.println("Producto no encontrado.");
            return;
        }
        Producto prod = opt.get();
        System.out.println("Valores actuales:");
        System.out.println("  Nombre: " + prod.getNombre());
        System.out.println("  Precio: " + prod.getPrecio());
        System.out.println("  Stock: " + prod.getStock());

        System.out.print("Nuevo nombre (Enter para mantener): ");
        String nombre = sc.nextLine().trim();
        if (!nombre.isEmpty()) prod.setNombre(nombre);

        System.out.print("Nuevo precio (Enter para mantener): ");
        String precioStr = sc.nextLine().trim();
        if (!precioStr.isEmpty()) {
            try {
                double precio = Double.parseDouble(precioStr);
                if (precio <= 0) {
                    System.out.println("Error: el precio debe ser mayor a 0.");
                    return;
                }
                prod.setPrecio(precio);
            } catch (NumberFormatException e) {
                System.out.println("Error: precio inválido.");
                return;
            }
        }

        System.out.print("Nuevo stock (Enter para mantener): ");
        String stockStr = sc.nextLine().trim();
        if (!stockStr.isEmpty()) {
            try {
                int stock = Integer.parseInt(stockStr);
                if (stock < 0) {
                    System.out.println("Error: el stock no puede ser negativo.");
                    return;
                }
                prod.setStock(stock);
            } catch (NumberFormatException e) {
                System.out.println("Error: stock inválido.");
                return;
            }
        }

        productoRepo.guardar(prod);
        System.out.println("Producto actualizado.");
    }

    private static void bajaProducto() {
        listarProductos();
        Long id = leerId("ID de producto a eliminar: ");
        if (id == null) return;
        
        boolean eliminado = productoRepo.eliminarLogico(id);
        if (eliminado) {
            System.out.println("Producto eliminado (baja lógica).");
        } else {
            System.out.println("Producto no encontrado o ya eliminado.");
        }
    }

    private static void listarProductos() {
        List<Producto> productos = productoRepo.listarActivos();
        if (productos.isEmpty()) {
            System.out.println("No hay productos activos.");
            return;
        }
        System.out.println("\n--- PRODUCTOS ACTIVOS ---");
        for (Producto p : productos) {
            System.out.println("ID: " + p.getId() + " | Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock() + " | Disponible: " + (p.getDisponible() ? "Sí" : "No"));
        }
    }

    // ==================== SUBMENÚ USUARIOS ====================

    private static void menuUsuarios() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n--- GESTIÓN DE USUARIOS ---");
            System.out.println("1. Alta");
            System.out.println("2. Modificar");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            if (op.isEmpty()) {
                System.out.println("Opción inválida.");
                continue;
            }
            switch (op) {
                case "1": altaUsuario(); break;
                case "2": modificarUsuario(); break;
                case "3": bajaUsuario(); break;
                case "4": listarUsuarios(); break;
                case "5": buscarUsuarioPorMail(); break;
                case "0": volver = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaUsuario() {
        System.out.print("Nombre: ");
        String nombre = sc.nextLine().trim();
        if (nombre.isEmpty()) {
            System.out.println("Error: el nombre es obligatorio.");
            return;
        }
        
        System.out.print("Apellido: ");
        String apellido = sc.nextLine().trim();
        if (apellido.isEmpty()) {
            System.out.println("Error: el apellido es obligatorio.");
            return;
        }
        
        System.out.print("Mail: ");
        String mail = sc.nextLine().trim();
        if (mail.isEmpty()) {
            System.out.println("Error: el mail es obligatorio.");
            return;
        }

        Optional<Usuario> existe = usuarioRepo.buscarPorMail(mail);
        if (existe.isPresent()) {
            System.out.println("Error: ya existe un usuario con ese mail.");
            return;
        }

        System.out.print("Celular: ");
        String celular = sc.nextLine().trim();
        
        System.out.print("Contraseña: ");
        String password = sc.nextLine().trim();
        if (password.isEmpty()) {
            System.out.println("Error: la contraseña es obligatoria.");
            return;
        }
        
        System.out.print("Rol (ADMIN/USUARIO): ");
        String rolStr = sc.nextLine().trim().toUpperCase();
        Rol rol = rolStr.equals("ADMIN") ? Rol.ADMIN : Rol.USUARIO;

        Usuario usuario = Usuario.builder()
                .nombre(nombre)
                .apellido(apellido)
                .mail(mail)
                .celular(celular.isEmpty() ? null : celular)
                .contraseña(password)
                .rol(rol)
                .build();

        Usuario guardado = usuarioRepo.guardar(usuario);
        System.out.println("Usuario creado con ID: " + guardado.getId());
    }

    private static void modificarUsuario() {
        listarUsuarios();
        Long id = leerId("ID de usuario a modificar: ");
        if (id == null) return;
        
        Optional<Usuario> opt = usuarioRepo.buscarPorId(id);
        if (opt.isEmpty()) {
            System.out.println("Usuario no encontrado.");
            return;
        }
        Usuario user = opt.get();
        System.out.println("Valores actuales:");
        System.out.println("  Nombre: " + user.getNombre());
        System.out.println("  Apellido: " + user.getApellido());
        System.out.println("  Mail: " + user.getMail());
        System.out.println("  Celular: " + (user.getCelular() == null ? "-" : user.getCelular()));

        System.out.print("Nuevo nombre (Enter para mantener): ");
        String nombre = sc.nextLine().trim();
        if (!nombre.isEmpty()) user.setNombre(nombre);

        System.out.print("Nuevo apellido (Enter para mantener): ");
        String apellido = sc.nextLine().trim();
        if (!apellido.isEmpty()) user.setApellido(apellido);

        System.out.print("Nuevo mail (Enter para mantener): ");
        String mail = sc.nextLine().trim();
        if (!mail.isEmpty()) {
            Optional<Usuario> existe = usuarioRepo.buscarPorMail(mail);
            if (existe.isPresent() && !existe.get().getId().equals(user.getId())) {
                System.out.println("Error: ese mail ya está en uso por otro usuario.");
                return;
            }
            user.setMail(mail);
        }

        System.out.print("Nuevo celular (Enter para mantener): ");
        String celular = sc.nextLine().trim();
        if (!celular.isEmpty()) user.setCelular(celular);

        System.out.print("Nueva contraseña (Enter para mantener): ");
        String password = sc.nextLine().trim();
        if (!password.isEmpty()) user.setContraseña(password);

        usuarioRepo.guardar(user);
        System.out.println("Usuario actualizado.");
    }

    private static void bajaUsuario() {
        listarUsuarios();
        Long id = leerId("ID de usuario a eliminar: ");
        if (id == null) return;
        
        boolean eliminado = usuarioRepo.eliminarLogico(id);
        if (eliminado) {
            System.out.println("Usuario eliminado (baja lógica).");
        } else {
            System.out.println("Usuario no encontrado o ya eliminado.");
        }
    }

    private static void listarUsuarios() {
        List<Usuario> usuarios = usuarioRepo.listarActivos();
        if (usuarios.isEmpty()) {
            System.out.println("No hay usuarios activos.");
            return;
        }
        System.out.println("\n--- USUARIOS ACTIVOS ---");
        for (Usuario u : usuarios) {
            System.out.println("ID: " + u.getId() + " | Nombre: " + u.getNombre() + " " + u.getApellido() + " | Mail: " + u.getMail() + " | Rol: " + u.getRol());
        }
    }

    private static void buscarUsuarioPorMail() {
        System.out.print("Mail a buscar: ");
        String mail = sc.nextLine().trim();
        if (mail.isEmpty()) {
            System.out.println("Operación cancelada.");
            return;
        }
        Optional<Usuario> opt = usuarioRepo.buscarPorMail(mail);
        if (opt.isEmpty()) {
            System.out.println("No existe un usuario activo con ese mail.");
            return;
        }
        Usuario u = opt.get();
        System.out.println("ID: " + u.getId());
        System.out.println("Nombre: " + u.getNombre() + " " + u.getApellido());
        System.out.println("Mail: " + u.getMail());
        System.out.println("Celular: " + (u.getCelular() == null ? "-" : u.getCelular()));
        System.out.println("Rol: " + u.getRol());
    }

    // ==================== SUBMENÚ PEDIDOS ====================

    private static void menuPedidos() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n--- GESTIÓN DE PEDIDOS ---");
            System.out.println("1. Alta de pedido");
            System.out.println("2. Cambiar estado");
            System.out.println("3. Baja lógica");
            System.out.println("4. Listado");
            System.out.println("5. Pedidos por usuario");
            System.out.println("6. Pedidos por estado");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            if (op.isEmpty()) {
                System.out.println("Opción inválida.");
                continue;
            }
            switch (op) {
                case "1": altaPedido(); break;
                case "2": cambiarEstadoPedido(); break;
                case "3": bajaPedido(); break;
                case "4": listarPedidos(); break;
                case "5": pedidosPorUsuario(); break;
                case "6": pedidosPorEstado(); break;
                case "0": volver = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
    }

    private static void altaPedido() {
        listarUsuarios();
        Long userId = leerId("ID del usuario: ");
        if (userId == null) return;
        
        Optional<Usuario> optUser = usuarioRepo.buscarPorId(userId);
        if (optUser.isEmpty()) {
            System.out.println("Usuario no encontrado.");
            return;
        }
        Usuario usuario = optUser.get();

        System.out.println("Formas de pago: TARJETA, TRANSFERENCIA, EFECTIVO");
        System.out.print("Forma de pago: ");
        String fp = sc.nextLine().trim().toUpperCase();
        if (fp.isEmpty()) {
            System.out.println("Forma de pago inválida.");
            return;
        }
        FormaPago formaPago;
        try {
            formaPago = FormaPago.valueOf(fp);
        } catch (IllegalArgumentException e) {
            System.out.println("Forma de pago inválida.");
            return;
        }

        List<Object[]> productosTemp = new ArrayList<>();
        boolean seguir = true;
        while (seguir) {
            listarProductos();
            System.out.print("ID del producto (0 para terminar): ");
            String prodIdStr = sc.nextLine().trim();
            if (prodIdStr.isEmpty()) {
                System.out.println("ID inválido.");
                continue;
            }
            Long prodId = Long.parseLong(prodIdStr);
            if (prodId == 0) break;

            Optional<Producto> optProd = productoRepo.buscarPorId(prodId);
            if (optProd.isEmpty()) {
                System.out.println("Producto no encontrado.");
                continue;
            }
            Producto prod = optProd.get();
            if (!prod.getDisponible()) {
                System.out.println("Producto no disponible.");
                continue;
            }
            System.out.print("Cantidad: ");
            String cantStr = sc.nextLine().trim();
            if (cantStr.isEmpty()) {
                System.out.println("Cantidad inválida.");
                continue;
            }
            int cantidad = Integer.parseInt(cantStr);
            if (cantidad <= 0) {
                System.out.println("Cantidad inválida.");
                continue;
            }
            if (cantidad > prod.getStock()) {
                System.out.println("Stock insuficiente. Stock disponible: " + prod.getStock());
                continue;
            }
            productosTemp.add(new Object[]{prod, cantidad});
            System.out.print("Agregar otro producto? (S/N): ");
            String resp = sc.nextLine().trim().toUpperCase();
            if (!resp.equals("S")) seguir = false;
        }

        if (productosTemp.isEmpty()) {
            System.out.println("El pedido debe tener al menos un producto.");
            return;
        }

        EntityManagerFactory emf = JPAUtil.getEntityManagerFactory();
        EntityManager em = emf.createEntityManager();
        EntityTransaction tx = em.getTransaction();

        try {
            tx.begin();

            Pedido pedido = Pedido.builder()
                    .usuario(usuario)
                    .fecha(LocalDate.now())
                    .estado(EstadoPedido.PENDIENTE)
                    .formaPago(formaPago)
                    .total(0.0)
                    .build();

            for (Object[] item : productosTemp) {
                Producto prod = (Producto) item[0];
                int cantidad = (int) item[1];

                Producto prodGestionado = em.find(Producto.class, prod.getId());

                DetallePedido detalle = DetallePedido.builder()
                        .cantidad(cantidad)
                        .producto(prodGestionado)
                        .subtotal(prodGestionado.getPrecio() * cantidad)
                        .pedido(pedido)
                        .build();

                pedido.getDetalles().add(detalle);

                prodGestionado.setStock(prodGestionado.getStock() - cantidad);
                em.merge(prodGestionado);
            }

            pedido.calcularTotal();
            em.persist(pedido);
            tx.commit();

            System.out.println("Pedido creado exitosamente!");
            System.out.println("ID: " + pedido.getId());
            System.out.println("Fecha: " + pedido.getFecha());
            System.out.println("Usuario: " + usuario.getNombre() + " " + usuario.getApellido());
            System.out.println("Total: $" + pedido.getTotal());
            System.out.println("Productos:");
            for (DetallePedido d : pedido.getDetalles()) {
                System.out.println("  - " + d.getProducto().getNombre() + " x " + d.getCantidad() + " = $" + d.getSubtotal());
            }

        } catch (Exception e) {
            if (tx.isActive()) tx.rollback();
            System.out.println("Error al crear el pedido: " + e.getMessage());
        } finally {
            em.close();
        }
    }

    private static void cambiarEstadoPedido() {
        listarPedidos();
        Long id = leerId("ID del pedido: ");
        if (id == null) return;
        
        Optional<Pedido> opt = pedidoRepo.buscarPorId(id);
        if (opt.isEmpty()) {
            System.out.println("Pedido no encontrado.");
            return;
        }
        Pedido pedido = opt.get();
        System.out.println("Estado actual: " + pedido.getEstado());
        System.out.println("Nuevo estado (PENDIENTE, CONFIRMADO, TERMINADO, CANCELADO): ");
        String estadoStr = sc.nextLine().trim().toUpperCase();
        if (estadoStr.isEmpty()) {
            System.out.println("Operación cancelada.");
            return;
        }
        try {
            EstadoPedido nuevoEstado = EstadoPedido.valueOf(estadoStr);
            pedido.setEstado(nuevoEstado);
            pedidoRepo.guardar(pedido);
            System.out.println("Estado actualizado a: " + nuevoEstado);
        } catch (IllegalArgumentException e) {
            System.out.println("Estado inválido.");
        }
    }

    private static void bajaPedido() {
        listarPedidos();
        Long id = leerId("ID del pedido a eliminar: ");
        if (id == null) return;
        
        boolean eliminado = pedidoRepo.eliminarLogico(id);
        if (eliminado) {
            System.out.println("Pedido eliminado (baja lógica).");
        } else {
            System.out.println("Pedido no encontrado o ya eliminado.");
        }
    }

    private static void listarPedidos() {
        List<Pedido> pedidos = pedidoRepo.listarActivos();
        if (pedidos.isEmpty()) {
            System.out.println("No hay pedidos activos.");
            return;
        }
        System.out.println("\n--- PEDIDOS ACTIVOS ---");
        for (Pedido p : pedidos) {
            System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Estado: " + p.getEstado() + " | Total: $" + p.getTotal());
        }
    }

    private static void pedidosPorUsuario() {
        listarUsuarios();
        Long id = leerId("ID del usuario: ");
        if (id == null) return;
        
        List<Pedido> pedidos = pedidoRepo.buscarPorUsuario(id);
        if (pedidos.isEmpty()) {
            System.out.println("El usuario no tiene pedidos activos.");
            return;
        }
        for (Pedido p : pedidos) {
            System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Estado: " + p.getEstado() + " | Total: $" + p.getTotal());
        }
    }

    private static void pedidosPorEstado() {
        System.out.println("Estados: PENDIENTE, CONFIRMADO, TERMINADO, CANCELADO");
        System.out.print("Estado: ");
        String estadoStr = sc.nextLine().trim().toUpperCase();
        if (estadoStr.isEmpty()) {
            System.out.println("Operación cancelada.");
            return;
        }
        try {
            EstadoPedido estado = EstadoPedido.valueOf(estadoStr);
            List<Pedido> pedidos = pedidoRepo.buscarPorEstado(estado);
            if (pedidos.isEmpty()) {
                System.out.println("No hay pedidos con estado " + estado);
                return;
            }
            for (Pedido p : pedidos) {
                System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Total: $" + p.getTotal());
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Estado inválido.");
        }
    }

    // ==================== SUBMENÚ REPORTES ====================

    private static void menuReportes() {
        boolean volver = false;
        while (!volver) {
            System.out.println("\n--- REPORTES ---");
            System.out.println("1. Productos por categoría");
            System.out.println("2. Pedidos por usuario");
            System.out.println("3. Pedidos por estado");
            System.out.println("4. Total facturado");
            System.out.println("0. Volver");
            System.out.print("Opción: ");
            String op = sc.nextLine().trim();
            if (op.isEmpty()) {
                System.out.println("Opción inválida.");
                continue;
            }
            switch (op) {
                case "1": reporteProductosPorCategoria(); break;
                case "2": reportePedidosPorUsuario(); break;
                case "3": reportePedidosPorEstado(); break;
                case "4": reporteTotalFacturado(); break;
                case "0": volver = true; break;
                default: System.out.println("Opción inválida.");
            }
        }
    }

    private static void reporteProductosPorCategoria() {
        listarCategorias();
        Long id = leerId("ID de categoría: ");
        if (id == null) return;
        
        List<Producto> productos = productoRepo.buscarPorCategoria(id);
        if (productos.isEmpty()) {
            System.out.println("No hay productos activos en esta categoría.");
            return;
        }
        for (Producto p : productos) {
            System.out.println("ID: " + p.getId() + " | Nombre: " + p.getNombre() + " | Precio: $" + p.getPrecio() + " | Stock: " + p.getStock());
        }
    }

    private static void reportePedidosPorUsuario() {
        listarUsuarios();
        Long id = leerId("ID del usuario: ");
        if (id == null) return;
        
        List<Pedido> pedidos = pedidoRepo.buscarPorUsuario(id);
        if (pedidos.isEmpty()) {
            System.out.println("El usuario no tiene pedidos activos.");
            return;
        }
        for (Pedido p : pedidos) {
            System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Estado: " + p.getEstado() + " | Forma pago: " + p.getFormaPago() + " | Total: $" + p.getTotal());
        }
    }

    private static void reportePedidosPorEstado() {
        System.out.println("Estados: PENDIENTE, CONFIRMADO, TERMINADO, CANCELADO");
        System.out.print("Estado: ");
        String estadoStr = sc.nextLine().trim().toUpperCase();
        if (estadoStr.isEmpty()) {
            System.out.println("Operación cancelada.");
            return;
        }
        try {
            EstadoPedido estado = EstadoPedido.valueOf(estadoStr);
            List<Pedido> pedidos = pedidoRepo.buscarPorEstado(estado);
            if (pedidos.isEmpty()) {
                System.out.println("No hay pedidos con estado " + estado);
                return;
            }
            for (Pedido p : pedidos) {
                System.out.println("ID: " + p.getId() + " | Fecha: " + p.getFecha() + " | Usuario ID: " + (p.getUsuario() != null ? p.getUsuario().getId() : "N/A") + " | Total: $" + p.getTotal());
            }
        } catch (IllegalArgumentException e) {
            System.out.println("Estado inválido.");
        }
    }

    private static void reporteTotalFacturado() {
        List<Pedido> pedidos = pedidoRepo.buscarPorEstado(EstadoPedido.TERMINADO);
        double total = 0.0;
        for (Pedido p : pedidos) {
            if (p.getTotal() != null) {
                total += p.getTotal();
            }
        }
        System.out.printf(Locale.US, "Total facturado: $%.2f%n", total);
    }
}