package com.chatapp.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register standard SockJS endpoint for browser compatibility
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Also register raw WebSocket endpoint
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Destination prefix for messages routed to @MessageMapping annotated methods
        registry.setApplicationDestinationPrefixes("/app");

        // Enable simple memory-based message broker for broadcasting to subscribed clients
        // /topic -> public/broadcast channels
        // /queue -> direct point-to-point channels
        // /user  -> user-specific private notifications
        registry.enableSimpleBroker("/topic", "/queue", "/user");

        // Prefix used to designate user-specific destinations
        registry.setUserDestinationPrefix("/user");
    }
}
