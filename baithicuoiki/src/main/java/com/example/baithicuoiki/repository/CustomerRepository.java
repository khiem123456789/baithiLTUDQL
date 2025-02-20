package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByUserId(Long userId);
    boolean existsByPhone(String phone);

    @Query("SELECT COUNT(c) FROM Customer c")
    Long countTotalCustomers();
}
