package com.example.baithicuoiki.controller.user;

import com.example.baithicuoiki.dto.CartRequestDTO;
import com.example.baithicuoiki.dto.RemoveSelectedDTO;
import com.example.baithicuoiki.model.User;
import com.example.baithicuoiki.security.jwt.JwtUtil;
import com.example.baithicuoiki.service.CartService;
import com.example.baithicuoiki.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartApiController {
    @Autowired
    private final CartService cartService;
    @Autowired
    private final UserService userService;
    @Autowired
    private final JwtUtil jwtUtil;

    private User getAuthenticatedUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Bạn chưa đăng nhập.");
        }

        String jwt = authHeader.substring(7);
        String username = jwtUtil.extractUsername(jwt);
        return userService.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng."));
    }

    @GetMapping
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        Map<String, Object> response = new HashMap<>();
        response.put("cartItems", cartService.getCartItems(user));
        response.put("totalCartPrice", cartService.getTotalCartPrice(user));

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartRequestDTO cartRequest, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        cartService.addToCart(user, cartRequest.getProductId(), cartRequest.getQuantity());
        return ResponseEntity.ok("Sản phẩm đã được thêm vào giỏ hàng.");
    }

    @PostMapping("/removeSelected")
    public ResponseEntity<?> removeSelected(@RequestBody RemoveSelectedDTO removeRequest, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        if (removeRequest.getProductIds() != null && !removeRequest.getProductIds().isEmpty()) {
            removeRequest.getProductIds().forEach(productId -> cartService.removeFromCart(user, productId));
            return ResponseEntity.ok("Đã xóa các sản phẩm khỏi giỏ hàng.");
        } else {
            return ResponseEntity.badRequest().body("Danh sách sản phẩm cần xóa không hợp lệ.");
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@Valid @PathVariable Long productId, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        cartService.removeFromCart(user, productId);
        return ResponseEntity.ok("Sản phẩm đã được xóa khỏi giỏ hàng.");
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCartItem(@RequestBody CartRequestDTO cartRequest, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        if (cartRequest.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Số lượng sản phẩm phải lớn hơn 0.");
        }

        cartService.updateCartItemQuantity(user, cartRequest.getProductId(), cartRequest.getQuantity());
        return ResponseEntity.ok("Số lượng sản phẩm đã được cập nhật.");
    }


    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        cartService.clearCard(user);
        return ResponseEntity.ok("Giỏ hàng đã được làm trống.");
    }

}
