package com.chatapp.controller;

import com.chatapp.dto.UserDto;
import com.chatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String currentUsername = authentication.getName();
        return ResponseEntity.ok(userService.getUserByUsername(currentUsername));
    }

    @GetMapping("/online")
    public ResponseEntity<List<UserDto>> getOnlineUsers() {
        return ResponseEntity.ok(userService.getAllOnlineUsers());
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
