package com.example.baithicuoiki.controller.user;

import com.example.baithicuoiki.model.Customer;
import com.example.baithicuoiki.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CustomerApiUserController {

    private final CustomerService customerService;

    // Lấy thông tin khách hàng của chính người dùng (Chỉ cho phép User truy cập thông tin của mình)
    @GetMapping("/{userId}")
    public ResponseEntity<Customer> getCustomerByUserId(@PathVariable Long userId) {
        Optional<Customer> customer = customerService.getCustomerByUserId(userId);
        return customer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cập nhật thông tin khách hàng của chính người dùng (Chỉ cho phép User cập nhật thông tin của mình)
    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody Customer customer) {
        try {
            customer.setId(id);
            Customer updatedCustomer = customerService.updateCustomer(customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (IllegalStateException ex) {
            return ResponseEntity.notFound().build();
        }
    }


}
