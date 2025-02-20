package com.example.baithicuoiki.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueByCategoryDTO {
    private String categoryName;
    private double totalRevenue;
}
