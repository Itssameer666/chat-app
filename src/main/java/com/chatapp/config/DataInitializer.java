package com.chatapp.config;

import com.chatapp.model.User;
import com.chatapp.model.UserStatus;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initDemoUsers() {
        return args -> {
            // Seed Alice
            if (!userRepository.existsByUsername("alice")) {
                User alice = User.builder()
                        .username("alice")
                        .email("alice@example.com")
                        .password(passwordEncoder.encode("Password123!"))
                        .avatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=alice")
                        .status(UserStatus.OFFLINE)
                        .lastSeen(LocalDateTime.now())
                        .build();
                userRepository.save(alice);
                log.info("Initialized demo user: alice");
            }

            // Seed Bob
            if (!userRepository.existsByUsername("bob")) {
                User bob = User.builder()
                        .username("bob")
                        .email("bob@example.com")
                        .password(passwordEncoder.encode("Password123!"))
                        .avatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=bob")
                        .status(UserStatus.OFFLINE)
                        .lastSeen(LocalDateTime.now())
                        .build();
                userRepository.save(bob);
                log.info("Initialized demo user: bob");
            }
        };
    }
}
