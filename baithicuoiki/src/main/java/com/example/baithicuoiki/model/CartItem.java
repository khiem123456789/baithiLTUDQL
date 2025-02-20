package com.example.baithicuoiki.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  id;
    @ManyToOne// Mối quan hệ nhiều-đến-một giữa CartItem và Cart (mỗi CartItem thuộc về một Cart).
    @JoinColumn(name = "cart_id",nullable = false)
    @JsonBackReference("cart-items")
    private Cart cart;
    @ManyToOne // Mối quan hệ nhiều-đến-một giữa CartItem và Product (mỗi CartItem liên kết với một Product).
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;
    private int quantity;

    private double totalPrice;

    public CartItem(int quantity, Product product, Cart cart) {
        this.quantity = quantity;
        this.product = product;
        this.totalPrice = product.getPrice() * quantity;
        this.cart = cart;
    }

    // Update totalPrice based on quantity and product price
    public void updateTotalPrice() {
        this.totalPrice = this.product.getPrice() * this.quantity;
    }
}
