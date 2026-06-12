package com.tp.jpa.repository;

import com.tp.jpa.model.Pedido;
import com.tp.jpa.model.enums.EstadoPedido;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {

    public PedidoRepository() {
        super(Pedido.class);
    }

    /**
     * Retorna los pedidos activos del usuario indicado.
     * Consulta JPQL: SELECT p FROM Pedido p WHERE p.usuario.id = :uid AND p.eliminado = false
     */
    public List<Pedido> buscarPorUsuario(Long idUsuario) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT p FROM Pedido p WHERE p.usuario.id = :uid AND p.eliminado = false";
            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("uid", idUsuario);
            return query.getResultList();
        } finally {
            em.close();
        }
    }

    /**
     * Retorna los pedidos activos que coinciden con el estado indicado.
     * Consulta JPQL: SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false
     */
    public List<Pedido> buscarPorEstado(EstadoPedido estadoPedido) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT p FROM Pedido p WHERE p.estado = :estado AND p.eliminado = false";
            TypedQuery<Pedido> query = em.createQuery(jpql, Pedido.class);
            query.setParameter("estado", estadoPedido);
            return query.getResultList();
        } finally {
            em.close();
        }
    }
}