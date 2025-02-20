package com.example.baithicuoiki.service;

import com.example.baithicuoiki.dto.OrderStatisticDTO;
import com.example.baithicuoiki.dto.OverviewStatisticDTO;
import com.example.baithicuoiki.dto.ProductSalesDTO;
import com.example.baithicuoiki.dto.RevenueByCategoryDTO;
import com.example.baithicuoiki.model.Order;
import com.example.baithicuoiki.repository.CustomerRepository;
import com.example.baithicuoiki.repository.OrderDetailRepository;
import com.example.baithicuoiki.repository.OrderRepository;
import com.example.baithicuoiki.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderDetailRepository orderDetailRepository;

    // Thống kê tổng quan
    public OverviewStatisticDTO getOverallStatistics() {
        Long totalOrders = orderRepository.count();
        Long totalCustomers = customerRepository.countTotalCustomers();
        Double totalRevenue = orderRepository.findAll()
                .stream().mapToDouble(Order::getTotalPrice).sum();

        return new OverviewStatisticDTO(totalOrders, totalCustomers, totalRevenue);
    }

    // Thống kê doanh thu theo danh mục
    public List<RevenueByCategoryDTO> getRevenueByCategory() {
        List<Object[]> results = productRepository.getRevenueByCategory();
        return results.stream()
                .map(r -> new RevenueByCategoryDTO((String) r[0], (Double) r[1]))
                .collect(Collectors.toList());
    }

    // Thống kê số lượng sản phẩm bán ra
    public List<ProductSalesDTO> getProductSalesCount() {
        List<Object[]> results = orderDetailRepository.getProductSalesCount();
        return results.stream()
                .map(r -> new ProductSalesDTO((String) r[0], ((Number) r[1]).intValue()))
                .collect(Collectors.toList());
    }

//    // Lọc đơn hàng theo ngày
//    public List<OrderStatisticDTO> getOrdersByDate(LocalDate date) {
//        return orderRepository.findByDate(date).stream()
//                .map(o -> new OrderStatisticDTO(o.getId(),
//                        o.getCustomerName(),
//                        o.getTotalPrice(),
//                        o.getStatus(),
//                        o.getCreatedDate()))
//                .collect(Collectors.toList());
//    }
//
//    // Lọc đơn hàng theo tháng & năm
//    public List<OrderStatisticDTO> getOrdersByMonthAndYear(int month, int year) {
//        return orderRepository.findByMonthAndYear(month, year).stream()
//                .map(o -> new OrderStatisticDTO(o.getId(),
//                        o.getCustomerName(),
//                        o.getTotalPrice(),
//                        o.getStatus(),
//                        o.getCreatedDate()))
//                .collect(Collectors.toList());
//    }
//
//    // Lọc đơn hàng theo năm
//    public List<OrderStatisticDTO> getOrdersByYear(int year) {
//        return orderRepository.findByYear(year).stream()
//                .map(o -> new OrderStatisticDTO(o.getId(),
//                        o.getCustomerName(),
//                        o.getTotalPrice(),
//                        o.getStatus(),
//                        o.getCreatedDate()))
//                .collect(Collectors.toList());
//    }
}

