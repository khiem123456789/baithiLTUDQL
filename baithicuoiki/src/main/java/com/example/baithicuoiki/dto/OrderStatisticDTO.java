package com.example.baithicuoiki.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class OrderStatisticDTO {
    private Long orderId;
    private String customerName;
    private double totalPrice;
    private String status;
    private LocalDateTime createdDate;
}