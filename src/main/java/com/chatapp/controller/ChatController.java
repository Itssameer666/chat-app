package com.chatapp.controller;

import com.chatapp.model.ChatMessage;
import com.chatapp.model.MessageType;
import com.chatapp.model.UserStatus;
import com.chatapp.repository.ChatMessageRepository;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    /**
     * Handles public messages sent to /app/chat.sendMessage
     * Saves to database and broadcasts to all subscribers of /topic/public
     */
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(LocalDateTime.now());
        }
        if (chatMessage.getMessageType() == null) {
            chatMessage.setMessageType(MessageType.CHAT);
        }

        // Persist message to database
        ChatMessage saved = chatMessageRepository.save(chatMessage);
        log.info("Broadcasting public message from {}: {}", saved.getSender(), saved.getContent());

        // Broadcast to public room subscribers
        messagingTemplate.convertAndSend("/topic/public", saved);
    }

    /**
     * Handles user joining public channel /app/chat.addUser
     * Adds username to WebSocket session, updates online status, and broadcasts JOIN event
     */
    @MessageMapping("/chat.addUser")
    public void addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor
    ) {
        String username = chatMessage.getSender();
        if (username != null && headerAccessor.getSessionAttributes() != null) {
            headerAccessor.getSessionAttributes().put("username", username);

            // Update user status in database to ONLINE
            userRepository.findByUsername(username).ifPresent(user -> {
                user.setStatus(UserStatus.ONLINE);
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);
            });
        }

        chatMessage.setMessageType(MessageType.JOIN);
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setContent(username + " joined the chat");

        log.info("User joined chat session: {}", username);
        messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }

    /**
     * Handles 1-on-1 private messages sent to /app/chat.private
     * Saves message and routes to both the recipient and the sender's private queue
     */
    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(LocalDateTime.now());
        }
        if (chatMessage.getMessageType() == null) {
            chatMessage.setMessageType(MessageType.CHAT);
        }

        // Save to database
        ChatMessage saved = chatMessageRepository.save(chatMessage);
        log.info("Routing private message from {} to {}: {}", saved.getSender(), saved.getRecipient(), saved.getContent());

        // Route to recipient user queue: /user/{recipient}/queue/messages
        messagingTemplate.convertAndSendToUser(
                saved.getRecipient(),
                "/queue/messages",
                saved
        );

        // Echo to sender's own queue so multi-tab or active session reflects sent message
        if (!saved.getSender().equalsIgnoreCase(saved.getRecipient())) {
            messagingTemplate.convertAndSendToUser(
                    saved.getSender(),
                    "/queue/messages",
                    saved
            );
        }
    }

    /**
     * Handles typing notifications sent to /app/chat.typing
     * Broadcasts typing event to recipient without persisting to database
     */
    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload ChatMessage chatMessage) {
        chatMessage.setMessageType(MessageType.TYPING);
        if (chatMessage.getRecipient() != null && !chatMessage.getRecipient().equalsIgnoreCase("public")) {
            messagingTemplate.convertAndSendToUser(
                    chatMessage.getRecipient(),
                    "/queue/typing",
                    chatMessage
            );
        } else {
            messagingTemplate.convertAndSend("/topic/typing", chatMessage);
        }
    }
}
