package com.example.baithicuoiki.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequestDTO {
    private Long productId;
    private int quantity;
}
