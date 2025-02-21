package com.example.baithicuoiki.controller.admin;

import com.example.baithicuoiki.dto.OrderRequestDTO;
import com.example.baithicuoiki.model.Order;
import com.example.baithicuoiki.model.OrderDetail;
import com.example.baithicuoiki.model.User;
import com.example.baithicuoiki.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderApiController {

    @Autowired
    private OrderService orderService;

    // Lấy danh sách đơn hàng (phân trang)
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Lấy thông tin chi tiết một đơn hàng
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    // Lấy danh sách chi tiết đơn hàng
    @GetMapping("/{orderId}/details")
    public ResponseEntity<List<OrderDetail>> getOrderDetails(@PathVariable Long orderId) {
        List<OrderDetail> orderDetails = orderService.getOrderDetails(orderId);
        return ResponseEntity.ok(orderDetails);
    }

    // Cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody OrderRequestDTO orderRequest) {
        orderService.updateOrderStatus(orderId, orderRequest.getStatus());
        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công!");
    }

    // Xóa đơn hàng
    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok("Xóa đơn hàng thành công!");
    }

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
