package com.example.baithicuoiki.service;

import com.example.baithicuoiki.model.Customer;
import com.example.baithicuoiki.model.User;
import com.example.baithicuoiki.repository.IRoleRepository;
import com.example.baithicuoiki.repository.IUserRepository;
import com.example.baithicuoiki.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IRoleRepository roleRepository;
    private final CustomerService customerService;
    private final JwtUtil jwtUtil;


    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);
    }

    public ResponseEntity<?> register(User request) {
        Map<String, String> errors = new HashMap<>();

        // Kiểm tra trùng username
        if (userRepository.existsByUsername(request.getUsername())) {
            errors.put("username", "Username already exists!");
        }

        // Kiểm tra trùng email
        if (userRepository.existsByEmail(request.getEmail())) {
            errors.put("email", "Email already exists!");
        }

        // Kiểm tra trùng số điện thoại
        if (userRepository.existsByPhone(request.getPhone())) {
            errors.put("phone", "Phone number already exists!");
        }

        // Nếu có lỗi, trả về danh sách lỗi
        if (!errors.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("errors", errors));
        }

        // Nếu không trùng lặp, tạo user mới
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .roles(Set.of(roleRepository.findByName("USER").orElseThrow()))
                .build();

        userRepository.save(user);


        // Tạo khách hàng mới từ thông tin user
        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFullName(request.getUsername()); // Lấy username làm tên khách hàng mặc định
        customer.setPhone(request.getPhone());
        customer.setAddress("unknown"); // Có thể để mặc định hoặc cập nhật sau

        customerService.saveCustomer(customer);

        return ResponseEntity.ok(Collections.singletonMap("message", "User registered successfully!"));
    }

    public String login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty() || !passwordEncoder.matches(password, userOptional.get().getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return jwtUtil.generateToken(userOptional.get());
    }
}
