-- =============================================================================
-- Database Schema for Real-time Chat Web Application
-- Engine: MySQL 8.x
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `chat_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `chat_db`;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Stores registered user profiles, status, credentials, and activity
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(255) NULL,
    `status` ENUM('ONLINE', 'OFFLINE') NOT NULL DEFAULT 'OFFLINE',
    `last_seen` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_username` (`username`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: chat_rooms
-- Associates direct conversation channels between pairs of users or groups
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_rooms` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `chat_id` VARCHAR(100) NOT NULL,
    `sender_id` BIGINT NOT NULL,
    `recipient_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_sender_recipient` (`sender_id`, `recipient_id`),
    INDEX `idx_chat_rooms_chat_id` (`chat_id`),
    INDEX `idx_chat_rooms_sender` (`sender_id`),
    INDEX `idx_chat_rooms_recipient` (`recipient_id`),
    CONSTRAINT `fk_chat_rooms_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chat_rooms_recipient` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: chat_messages
-- Stores historical chat messages, system notifications (JOIN/LEAVE), and typing signals
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `sender` VARCHAR(50) NOT NULL,
    `recipient` VARCHAR(100) NOT NULL COMMENT 'Target username or roomId',
    `content` TEXT NULL,
    `timestamp` DATETIME NOT NULL,
    `message_type` ENUM('CHAT', 'JOIN', 'LEAVE', 'TYPING') NOT NULL DEFAULT 'CHAT',
    INDEX `idx_chat_messages_sender` (`sender`),
    INDEX `idx_chat_messages_recipient` (`recipient`),
    INDEX `idx_chat_messages_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
