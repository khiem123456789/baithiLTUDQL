package com.example.baithicuoiki.service;

import com.example.baithicuoiki.model.Category;
import com.example.baithicuoiki.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Transactional
public class CategoryService {
    public final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    public Optional<Category> getCategoryById(Long id){
        return categoryRepository.findById(id);
    }
    public Category addCategory(Category category){
        return categoryRepository.save(category);
    }
    public Category  updateCategory(@NonNull Category category){
        Category existingCategory = categoryRepository.findById(category.getId()).orElseThrow(()->new IllegalStateException("Category with ID " + category.getId() + " does not exist."));
        existingCategory.setName(category.getName());
        return categoryRepository.save(existingCategory);
    }
    public void deleteCategory(Long id){
        if (!categoryRepository.existsById(id)){
            throw new IllegalStateException("Category with ID " + id + " does not exist.");
        }
        try {
            categoryRepository.deleteById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Không thể xóa danh mục. Danh mục này đang được sử dụng.");
        }
    }
}
