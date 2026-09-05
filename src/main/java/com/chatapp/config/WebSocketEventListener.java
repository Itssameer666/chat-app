package com.chatapp.config;

import com.chatapp.model.ChatMessage;
import com.chatapp.model.MessageType;
import com.chatapp.model.UserStatus;
import com.chatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final UserRepository userRepository;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = null;
        if (headerAccessor.getSessionAttributes() != null) {
            username = (String) headerAccessor.getSessionAttributes().get("username");
        }

        if (username != null) {
            log.info("User disconnected from WebSocket session: {}", username);

            // Update user status in database to OFFLINE
            final String disconnectedUser = username;
            userRepository.findByUsername(disconnectedUser).ifPresent(user -> {
                user.setStatus(UserStatus.OFFLINE);
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);
            });

            // Construct LEAVE message
            ChatMessage leaveMessage = ChatMessage.builder()
                    .sender(disconnectedUser)
                    .recipient("public")
                    .content(disconnectedUser + " left the chat")
                    .messageType(MessageType.LEAVE)
                    .timestamp(LocalDateTime.now())
                    .build();

            // Broadcast to all active users on /topic/public
            messagingTemplate.convertAndSend("/topic/public", leaveMessage);
        }
    }
}
