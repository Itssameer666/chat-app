package com.chatapp.service;

import com.chatapp.dto.UserDto;
import com.chatapp.model.User;
import com.chatapp.model.UserStatus;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return mapToDto(user);
    }

    public List<UserDto> getAllOnlineUsers() {
        return userRepository.findAllByStatus(UserStatus.ONLINE).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateUserStatus(String username, UserStatus status) {
        userRepository.findByUsername(username).ifPresent(user -> {
            user.setStatus(status);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    public UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .lastSeen(user.getLastSeen())
                .build();
    }
}
