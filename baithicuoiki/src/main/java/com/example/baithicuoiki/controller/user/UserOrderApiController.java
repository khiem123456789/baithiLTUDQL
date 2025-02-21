package com.example.baithicuoiki.controller.user;

import com.example.baithicuoiki.dto.OrderRequestDTO;
import com.example.baithicuoiki.model.Order;
import com.example.baithicuoiki.model.User;
import com.example.baithicuoiki.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/orders")
public class UserOrderApiController {

    @Autowired
    private OrderService orderService;

    // Lấy danh sách đơn hàng của người dùng
    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal User user) {
        List<Order> orders = orderService.getOrdersByUserId(user.getId());
        return ResponseEntity.ok(orders);
    }

    // Lấy thông tin chi tiết một đơn hàng của người dùng
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId, @AuthenticationPrincipal User user) {
        Order order = orderService.getOrderById(orderId);
        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Cấm truy cập nếu không phải đơn của user
        }
        return ResponseEntity.ok(order);
    }

    // Đặt hàng mới
    @PostMapping
    public ResponseEntity<Order> createOrder(
            @RequestBody OrderRequestDTO orderRequest,
            @AuthenticationPrincipal User user) {

        Order order = orderService.createOrder(
                orderRequest.getCustomerName(),
                orderRequest.getShippingAddress(),
                orderRequest.getPhoneNumber(),
                orderRequest.getNotes(),
                orderRequest.getPaymentMethod(),
                orderRequest.getCartItems(),
                user
        );
        return ResponseEntity.ok(order);
    }
}
