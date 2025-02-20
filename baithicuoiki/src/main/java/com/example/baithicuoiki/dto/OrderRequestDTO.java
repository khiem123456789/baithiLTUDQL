package com.example.baithicuoiki.dto;

import com.example.baithicuoiki.model.CartItem;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDTO {
    private String customerName;
    private String shippingAddress;
    private String phoneNumber;
    private String notes;
    private String paymentMethod;
    private String status;
    private List<CartItem> cartItems;
}
