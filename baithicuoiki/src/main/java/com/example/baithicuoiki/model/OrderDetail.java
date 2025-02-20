package com.example.baithicuoiki.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_details")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Positive(message = "Số lượng phải lớn hơn 0")
    private int quantity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference // "Order" là con, bỏ qua serialization khi serialize Customer
    private Order order;

    private double totalPrice;  // Thêm thuộc tính lưu giá trị tổng cho OrderDetail

    // Phương thức tính tổng giá của từng OrderDetail
    public double calculateTotalPrice() {
        if (product == null) {
            throw new IllegalStateException("Product must not be null");
        }
        return this.quantity * product.getPrice();
    }
}
