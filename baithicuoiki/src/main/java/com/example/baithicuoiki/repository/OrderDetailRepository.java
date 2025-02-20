package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.OrderDetail;
import com.example.baithicuoiki.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
    List<OrderDetail> findByOrderId(Long orderId);

    @Query("SELECT p.name, SUM(od.quantity) FROM OrderDetail od " +
            "JOIN od.product p GROUP BY p.name")
    List<Object[]> getProductSalesCount();
}
