package com.example.baithicuoiki.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductSalesDTO {
    private String productName;
    private int quantitySold;
}