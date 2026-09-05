package com.chatapp.controller;

import com.chatapp.dto.AuthResponse;
import com.chatapp.dto.LoginRequest;
import com.chatapp.dto.RegisterRequest;
import com.chatapp.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(Authentication authentication) {
        if (authentication != null && authentication.getName() != null) {
            authService.logout(authentication.getName());
        }
        return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
    }
}
