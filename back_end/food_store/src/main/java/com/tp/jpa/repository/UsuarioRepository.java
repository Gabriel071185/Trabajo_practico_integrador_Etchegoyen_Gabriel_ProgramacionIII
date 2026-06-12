package com.tp.jpa.repository;

import com.tp.jpa.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio de Usuario. Además del CRUD heredado implementa la búsqueda
 * de un usuario activo por su mail.
 */
public class UsuarioRepository extends BaseRepository<Usuario> {

    public UsuarioRepository() {
        super(Usuario.class);
    }

    /**
     * Retorna el usuario activo con el mail indicado.
     * Consulta JPQL: SELECT u FROM Usuario u WHERE u.mail = :mail AND u.eliminado = false
     */
    public Optional<Usuario> buscarPorMail(String mail) {
        EntityManager em = emf.createEntityManager();
        try {
            String jpql = "SELECT u FROM Usuario u WHERE u.mail = :mail AND u.eliminado = false";
            TypedQuery<Usuario> query = em.createQuery(jpql, Usuario.class);
            query.setParameter("mail", mail);
            List<Usuario> resultados = query.getResultList();
            return resultados.isEmpty() ? Optional.empty() : Optional.of(resultados.get(0));
        } finally {
            em.close();
        }
    }
}