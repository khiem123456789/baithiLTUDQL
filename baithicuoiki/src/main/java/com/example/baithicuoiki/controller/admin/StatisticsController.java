package com.example.baithicuoiki.controller.admin;

import com.example.baithicuoiki.dto.OrderStatisticDTO;
import com.example.baithicuoiki.dto.OverviewStatisticDTO;
import com.example.baithicuoiki.dto.ProductSalesDTO;
import com.example.baithicuoiki.dto.RevenueByCategoryDTO;
import com.example.baithicuoiki.model.Order;
import com.example.baithicuoiki.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    // API: Thống kê tổng quan
    @GetMapping("/overview")
    public ResponseEntity<OverviewStatisticDTO> getOverallStatistics() {
        return ResponseEntity.ok(statisticsService.getOverallStatistics());
    }

    // API: Thống kê doanh thu theo danh mục
    @GetMapping("/revenue-by-category")
    public ResponseEntity<List<RevenueByCategoryDTO>> getRevenueByCategory() {
        return ResponseEntity.ok(statisticsService.getRevenueByCategory());
    }

    // API: Thống kê số lượng sản phẩm bán ra
    @GetMapping("/product-sales")
    public ResponseEntity<List<ProductSalesDTO>> getProductSalesCount() {
        return ResponseEntity.ok(statisticsService.getProductSalesCount());
    }

}
