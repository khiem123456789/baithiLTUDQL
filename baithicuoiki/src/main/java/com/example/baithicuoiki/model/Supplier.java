package com.example.baithicuoiki.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "suppliers")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Tên nhà cung cấp không được để trống")
    @Size(max = 255, message = "Tên nhà cung cấp không được dài quá 255 ký tự")
    private String name;

    @Column(nullable = false)
    @NotNull(message = "Địa chỉ không được để trống")
    private String address;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Số điện thoại không được để trống")
    private String phone;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Email không được để trống")
    private String email;

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL)
    @JsonIgnore // Tránh vòng lặp khi serialize
    private List<StockEntry> stockEntries; // Liên kết với nhập kho
}
