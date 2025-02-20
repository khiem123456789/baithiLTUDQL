package com.example.baithicuoiki.controller.admin;

import com.example.baithicuoiki.model.Customer;
import com.example.baithicuoiki.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class CustomerApiAdminController {
    private final CustomerService customerService;

    // Lấy tất cả khách hàng (Chỉ cho phép ADMIN)
    @GetMapping

    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
    // Thêm mới khách hàng (Chỉ cho phép ADMIN)
    @PostMapping
    public ResponseEntity<Customer> addCustomer(@RequestBody Customer customer) {
        try {
            Customer savedCustomer = customerService.saveCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Cập nhật thông tin khách hàng (Chỉ cho phép ADMIN)
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

    // Xóa khách hàng (Chỉ cho phép ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomerById(@PathVariable Long id) {
        try {
            customerService.deleteCustomerById(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
