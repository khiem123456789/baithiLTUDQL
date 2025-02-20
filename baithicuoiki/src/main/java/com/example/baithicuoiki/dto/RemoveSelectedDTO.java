package com.example.baithicuoiki.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RemoveSelectedDTO {
    @NotEmpty(message = "Danh sách sản phẩm không được trống")
    private List<Long> productIds;
}
