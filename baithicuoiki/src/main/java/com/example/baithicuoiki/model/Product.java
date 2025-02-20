package com.example.baithicuoiki.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "products")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "Tên sản phẩm không được để trống")
    @Size(max = 255, message = "Tên sản phẩm không được dài quá 255 ký tự")
    private String name;

    @Column(nullable = false)
    @PositiveOrZero(message = "Giá sản phẩm phải lớn hơn hoặc bằng 0")
    private double price;

    @Column(nullable = true,columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "int default 0")
    private int quantity;

    private String image;//
    private String woodType;//
    private String size;//
    // Liên kết với bảng category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;//

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonIgnore // Tránh vòng lặp khi serialize
    private List<StockEntry> stockEntries; // Quan hệ với nhập kho

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime addedAt=LocalDateTime.now();;

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    private String status;//

}
