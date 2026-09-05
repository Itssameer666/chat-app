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
@Table(name = "chat_rooms", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_sender_recipient", columnNames = {"sender_id", "recipient_id"})
    },
    indexes = {
        @Index(name = "idx_chat_rooms_chat_id", columnList = "chat_id"),
        @Index(name = "idx_chat_rooms_sender", columnList = "sender_id"),
        @Index(name = "idx_chat_rooms_recipient", columnList = "recipient_id")
    }
)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chat_id", nullable = false, length = 100)
    private String chatId;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
