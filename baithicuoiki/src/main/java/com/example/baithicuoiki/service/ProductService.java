package com.example.baithicuoiki.service;

import com.example.baithicuoiki.model.Product;
import com.example.baithicuoiki.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    // Retrieve a product by its id
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    // Add a new product to the database
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }
    // Update an existing product
    public Product updateProduct(@NonNull Product product){
        Product existingProduct=productRepository.findById(product.getId())
                .orElseThrow(()-> new IllegalStateException("Product with ID " + product.getId() + " does not exist."));

        existingProduct.setName(product.getName());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setSize(product.getSize());
        existingProduct.setWoodType(product.getWoodType());
        existingProduct.setImage(product.getImage());
        existingProduct.setStatus(product.getStatus());
        int quantity = existingProduct.getQuantity()+product.getQuantity();
        existingProduct.setQuantity(quantity);

        return  productRepository.save(existingProduct);
    }
    // Delete a product by its id
    public void deleteProductById(Long id){
        if (!productRepository.existsById(id)){
            throw new IllegalStateException("Product with ID " + id + " does not exist.");
        }

        try {
            productRepository.deleteById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Không thể xóa sản phẩm. Sản phẩm này đang được sử dụng.");
        }
    }
}
