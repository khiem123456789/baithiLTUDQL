package com.example.baithicuoiki.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OverviewStatisticDTO {
    private Long totalOrders;
    private Long totalCustomers;
    private double totalRevenue;
}
