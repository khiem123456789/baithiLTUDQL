package com.example.baithicuoiki.controller;

import com.example.baithicuoiki.model.Category;
import com.example.baithicuoiki.model.Product;
import com.example.baithicuoiki.service.CategoryService;
import com.example.baithicuoiki.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductApiController {
    @Autowired
    private ProductService productService;
    @Autowired
    private CategoryService categoryService;
    @GetMapping
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    @PostMapping
    public  Product createProduct(@RequestBody Product product){
        Category category = categoryService.getCategoryById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
        return productService.addProduct(product);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id){
        Product product = productService.getProductById(id).orElseThrow(()-> new RuntimeException("Product not found on :: " + id));
        return ResponseEntity.ok().body(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetail){
        Product product = productService.getProductById(id).orElseThrow(() -> new RuntimeException("Product not found on :: " + id));
        Category category = categoryService.getCategoryById(productDetail.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(productDetail.getName());
        product.setPrice(productDetail.getPrice());
        product.setDescription(productDetail.getDescription());
        product.setImage(productDetail.getImage());
        product.setCategory(category);
        product.setStatus(productDetail.getStatus());
        product.setSize(productDetail.getSize());
        product.setWoodType(productDetail.getWoodType());
        product.setQuantity(productDetail.getQuantity());
        final Product updateProduct=productService.addProduct(product);

        return ResponseEntity.ok(updateProduct);
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> deleteProduct(@PathVariable Long id){
        Product product = productService.getProductById(id).orElseThrow(() -> new RuntimeException("Product not found on :: " + id));
        productService.deleteProductById(id);
        return  ResponseEntity.ok().build();
    }


}
