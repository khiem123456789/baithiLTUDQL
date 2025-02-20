package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product,Long> {

    @Query("SELECT p.category.name, SUM(od.quantity * od.totalPrice) " +
            "FROM OrderDetail od JOIN od.product p " +
            "GROUP BY p.category.name")
    List<Object[]> getRevenueByCategory();
}
