package com.example.baithicuoiki.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String shippingAddress;

    @Column(name = "phone", length = 10)
    @Length(min = 10, max = 10, message = "Phone must be 10 characters")
    private String phoneNumber;

    @Column(nullable = false)
    private String paymentMethod;

    private String notes;

    @PositiveOrZero(message = "Tổng giá phải lớn hơn hoặc bằng 0")
    private double totalPrice;

    private String status;

    private String  customerName;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true) // Có thể null nếu khách vãng lai
    @JsonBackReference("user-orders")// "Order" là con, bỏ qua serialization khi serialize User
    private User user;

    @ManyToOne// Quan hệ ManyToOne với Custommer
    @JoinColumn(name = "customer_id", nullable = true) // Khóa ngoại liên kết với bảng Customer
    @JsonBackReference("customer-orders") // "Order" là con, bỏ qua serialization khi serialize Customer
    private Customer customer;

    public double calculateTotalPrice() {
        return orderDetails != null ? orderDetails.stream()
                .mapToDouble(OrderDetail::getTotalPrice)
                .sum() : 0.0;
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // "Order" là cha,  quản lý danh sách "Order Detail"
    private List<OrderDetail> orderDetails;


    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate;

    //@PrePersist:đảm bảo giá trị được set từ Java khi lưu
    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    @PostPersist
    @PostUpdate
    public void updateCustomerTotalSpent() {
        if (customer != null) {
            customer.updateTotalSpent();
        }
    }
}