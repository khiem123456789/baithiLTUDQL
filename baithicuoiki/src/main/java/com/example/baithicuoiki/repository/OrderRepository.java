package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.Order;
import com.example.baithicuoiki.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order,Long> {

    List<Order> findByUserId(Long userId);


    @Query("SELECT o FROM Order o WHERE FUNCTION('DATE', o.createdDate) = :date")
    List<Order> findByDate(@Param("date") LocalDate date);

    @Query("SELECT o FROM Order o WHERE FUNCTION('YEAR', o.createdDate) = :year AND FUNCTION('MONTH', o.createdDate) = :month")
    List<Order> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT o FROM Order o WHERE FUNCTION('YEAR', o.createdDate) = :year")
    List<Order> findByYear(@Param("year") int year);
}
