package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.Product;
import com.example.baithicuoiki.model.Supplier;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public interface SupplierRepository extends JpaRepository<Supplier,Long> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}
