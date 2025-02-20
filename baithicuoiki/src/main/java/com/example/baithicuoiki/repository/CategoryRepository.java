package com.example.baithicuoiki.repository;

import com.example.baithicuoiki.model.Category;
import com.example.baithicuoiki.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
}
