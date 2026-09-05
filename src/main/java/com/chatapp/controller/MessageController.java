package com.chatapp.controller;

import com.chatapp.model.ChatMessage;
import com.chatapp.model.User;
import com.chatapp.repository.ChatMessageRepository;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    /**
     * Fetch paginated chat history between two users (by user ID or username)
     * e.g., GET /api/messages/1/2?page=0&size=50
     * or   GET /api/messages/john/jane?page=0&size=50
     */
    @GetMapping("/{senderId}/{recipientId}")
    public ResponseEntity<Page<ChatMessage>> getChatHistory(
            @PathVariable String senderId,
            @PathVariable String recipientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "ASC") String sortDirection
    ) {
        String user1 = resolveUsername(senderId);
        String user2 = resolveUsername(recipientId);

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") 
                ? Sort.Direction.DESC 
                : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "timestamp"));
        Page<ChatMessage> messages = chatMessageRepository.findConversationBetween(user1, user2, pageable);

        return ResponseEntity.ok(messages);
    }

    /**
     * Fetch public/group room message history
     * e.g., GET /api/messages/public?page=0&size=50
     */
    @GetMapping("/public")
    public ResponseEntity<Page<ChatMessage>> getPublicMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "timestamp"));
        Page<ChatMessage> messages = chatMessageRepository.findByRecipientOrderByTimestampAsc("public", pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Resolves identifier to username if given as numeric user ID, or returns identifier as is
     */
    private String resolveUsername(String identifier) {
        try {
            Long userId = Long.parseLong(identifier);
            return userRepository.findById(userId)
                    .map(User::getUsername)
                    .orElse(identifier);
        } catch (NumberFormatException e) {
            return identifier;
        }
    }
}
