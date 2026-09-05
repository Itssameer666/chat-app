package com.chatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chat_messages", indexes = {
    @Index(name = "idx_chat_messages_sender", columnList = "sender"),
    @Index(name = "idx_chat_messages_recipient", columnList = "recipient"),
    @Index(name = "idx_chat_messages_timestamp", columnList = "timestamp")
})
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String sender;

    /**
     * Recipient can be a direct user's username or a shared roomId
     */
    @Column(nullable = false, length = 100)
    private String recipient;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false, length = 20)
    @Builder.Default
    private MessageType messageType = MessageType.CHAT;

    @PrePersist
    protected void onCreate() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
        if (this.messageType == null) {
            this.messageType = MessageType.CHAT;
        }
    }
}
