package com.chatapp.repository;

import com.chatapp.model.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRecipientOrderByTimestampAsc(String recipient);

    Page<ChatMessage> findByRecipientOrderByTimestampAsc(String recipient, Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender = :user1 AND m.recipient = :user2) OR " +
           "(m.sender = :user2 AND m.recipient = :user1) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversationBetween(
            @Param("user1") String user1, 
            @Param("user2") String user2
    );

    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.sender = :user1 AND m.recipient = :user2) OR " +
           "(m.sender = :user2 AND m.recipient = :user1) " +
           "ORDER BY m.timestamp ASC")
    Page<ChatMessage> findConversationBetween(
            @Param("user1") String user1, 
            @Param("user2") String user2,
            Pageable pageable
    );

    List<ChatMessage> findBySenderOrderByTimestampAsc(String sender);
}
