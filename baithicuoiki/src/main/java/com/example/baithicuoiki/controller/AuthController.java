package com.example.baithicuoiki.controller;

import com.example.baithicuoiki.dto.JwtResponse;
import com.example.baithicuoiki.dto.LoginRequest;
import com.example.baithicuoiki.model.User;
import com.example.baithicuoiki.security.jwt.JwtUtil;
import com.example.baithicuoiki.service.CustomUserDetailsService;
import com.example.baithicuoiki.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<UserDetails> getCurrentUser(@RequestHeader("Authorization") String token){
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // Loại bỏ chữ "Bearer "
        }

        String username = jwtUtil.extractUsername(token);

        UserDetails user = userDetailsService.loadUserByUsername(username);

        return ResponseEntity.ok(user);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.register(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = userService.login(request.getUsername(), request.getPassword());
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        return ResponseEntity.ok(new JwtResponse(token));
    }
}
