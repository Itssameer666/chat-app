package com.chatapp.repository;

import com.chatapp.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

    List<ChatRoom> findByChatId(String chatId);

    List<ChatRoom> findBySenderId(Long senderId);
}
