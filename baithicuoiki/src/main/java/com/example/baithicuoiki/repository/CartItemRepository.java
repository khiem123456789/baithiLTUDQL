package com.example.baithicuoiki.repository;


import com.example.baithicuoiki.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    @Query("SELECT COUNT(ci) " +
            "FROM CartItem ci " +
            "JOIN ci.cart c " +
            "JOIN c.user u " +
            "WHERE u.username = :username")
    Long countCartItemByUsername(@Param("username") String username);

}
