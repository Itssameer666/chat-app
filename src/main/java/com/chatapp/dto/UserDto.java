package com.chatapp.dto;

import com.chatapp.model.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private UserStatus status;
    private LocalDateTime lastSeen;
}
