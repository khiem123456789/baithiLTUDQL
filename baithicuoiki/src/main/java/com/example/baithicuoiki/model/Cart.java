package com.example.baithicuoiki.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long  id;
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;

    @OneToMany(mappedBy = "cart",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference("cart-items")
    // Mối quan hệ một-đến-nhiều giữa Cart và CartItem. Một Cart có thể chứa nhiều CartItem.
    // cascade = CascadeType.ALL để các thao tác CRUD trên Cart cũng được áp dụng cho các CartItem liên quan.
    // orphanRemoval = true để tự động xóa CartItem nếu không còn liên kết tới Cart.
    private List<CartItem> items ;
}
