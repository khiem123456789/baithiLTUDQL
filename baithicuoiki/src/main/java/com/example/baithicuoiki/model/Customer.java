package com.example.baithicuoiki.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@Entity
@Table(name = "customers")
public class Customer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = true) // Có thể null nếu khách vãng lai
    private User user;

    @Column(nullable = false,length = 255)
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Column(name = "phone", length = 10, unique = true)
    @Length(min = 10, max = 10, message = "Phone must be 10 characters")
    @Pattern(regexp = "^[0-9]*$", message = "Phone must be number")
    private String phone;

    @Column(nullable = false,length = 255)
    @NotBlank(message = "Address is required")
    private String address;

    @OneToMany(mappedBy = "customer",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference("customer-orders") // "Customer" là cha, quản lý danh sách "Order"
    private List<Order> orders;

    @Column(nullable = false)
    private Double totalSpent=0.0;

    public void updateTotalSpent(){
        this.totalSpent= orders !=null ? orders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum():0.0;
    }
}
