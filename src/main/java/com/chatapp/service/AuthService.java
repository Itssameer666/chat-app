package com.chatapp.service;

import com.chatapp.config.JwtService;
import com.chatapp.dto.AuthResponse;
import com.chatapp.dto.LoginRequest;
import com.chatapp.dto.RegisterRequest;
import com.chatapp.model.User;
import com.chatapp.model.UserStatus;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered.");
        }

        User user = User.builder()
                .username(request.getUsername().trim().toLowerCase())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(request.getAvatarUrl())
                .status(UserStatus.ONLINE)
                .lastSeen(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser);

        log.info("User registered successfully: {}", savedUser.getUsername());

        return AuthResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .avatarUrl(savedUser.getAvatarUrl())
                .status(savedUser.getStatus())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsernameOrEmail().trim().toLowerCase();

        // Check if user exists first to provide clear error messages
        User user = userRepository.findByUsernameOrEmail(identifier, identifier)
                .orElseThrow(() -> new BadCredentialsException("Invalid username/email or password."));

        // Authenticate with AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        // Update online presence status
        user.setStatus(UserStatus.ONLINE);
        user.setLastSeen(LocalDateTime.now());
        User updatedUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(updatedUser);

        log.info("User logged in successfully: {}", updatedUser.getUsername());

        return AuthResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .id(updatedUser.getId())
                .username(updatedUser.getUsername())
                .email(updatedUser.getEmail())
                .avatarUrl(updatedUser.getAvatarUrl())
                .status(updatedUser.getStatus())
                .build();
    }

    @Transactional
    public void logout(String username) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setStatus(UserStatus.OFFLINE);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
            log.info("User logged out: {}", username);
        });
    }
}
