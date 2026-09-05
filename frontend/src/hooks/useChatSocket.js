import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/ws` : 'http://localhost:8080/ws');

export const useChatSocket = (currentUser, token) => {
  const [connected, setConnected] = useState(false);
  const [publicMessages, setPublicMessages] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const stompClientRef = useRef(null);
  const typingTimeoutsRef = useRef({});

  useEffect(() => {
    if (!currentUser || !token) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      setConnected(false);
      return;
    }

    const client = new Client({
      // Use SockJS fallback compatible with Spring Boot WebSocketConfig
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        // Uncomment for detailed STOMP debug:
        // console.log('[STOMP]:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket broker:', frame);
      setConnected(true);

      // 1. Announce presence to public channel
      client.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({
          sender: currentUser.username,
          messageType: 'JOIN',
          timestamp: new Date().toISOString(),
        }),
      });

      // 2. Subscribe to public broadcast channel
      client.subscribe('/topic/public', (message) => {
        try {
          const payload = JSON.parse(message.body);
          
          if (payload.messageType === 'JOIN') {
            setOnlineUsers((prev) => new Set([...prev, payload.sender]));
          } else if (payload.messageType === 'LEAVE') {
            setOnlineUsers((prev) => {
              const updated = new Set(prev);
              updated.delete(payload.sender);
              return updated;
            });
          }

          setPublicMessages((prev) => [...prev, payload]);
        } catch (e) {
          console.error('Error parsing public message:', e);
        }
      });

      // 3. Subscribe to user-specific private messages (/user/queue/messages)
      client.subscribe('/user/queue/messages', (message) => {
        try {
          const payload = JSON.parse(message.body);
          setPrivateMessages((prev) => [...prev, payload]);
        } catch (e) {
          console.error('Error parsing private message:', e);
        }
      });

      // 4. Subscribe to user-specific typing indicators (/user/queue/typing)
      client.subscribe('/user/queue/typing', (message) => {
        try {
          const payload = JSON.parse(message.body);
          const sender = payload.sender;

          if (sender && sender !== currentUser.username) {
            setTypingUsers((prev) => ({ ...prev, [sender]: true }));

            // Automatically clear typing status after 2.5 seconds
            if (typingTimeoutsRef.current[sender]) {
              clearTimeout(typingTimeoutsRef.current[sender]);
            }
            typingTimeoutsRef.current[sender] = setTimeout(() => {
              setTypingUsers((prev) => ({ ...prev, [sender]: false }));
            }, 2500);
          }
        } catch (e) {
          console.error('Error parsing typing message:', e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      setConnected(false);
    };

    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket broker');
      setConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [currentUser?.username, token]);

  // Method to send public chat message
  const sendPublicMessage = useCallback(
    (content) => {
      if (!stompClientRef.current || !stompClientRef.current.connected) {
        console.warn('STOMP client not connected.');
        return false;
      }

      stompClientRef.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          sender: currentUser.username,
          recipient: 'public',
          content,
          messageType: 'CHAT',
          timestamp: new Date().toISOString(),
        }),
      });
      return true;
    },
    [currentUser?.username]
  );

  // Method to send 1-on-1 private chat message
  const sendPrivateMessage = useCallback(
    (recipientUsername, content) => {
      if (!stompClientRef.current || !stompClientRef.current.connected) {
        console.warn('STOMP client not connected.');
        return false;
      }

      const msg = {
        sender: currentUser.username,
        recipient: recipientUsername,
        content,
        messageType: 'CHAT',
        timestamp: new Date().toISOString(),
      };

      stompClientRef.current.publish({
        destination: '/app/chat.private',
        body: JSON.stringify(msg),
      });

      return true;
    },
    [currentUser?.username]
  );

  // Method to emit typing indicator
  const sendTyping = useCallback(
    (recipientUsername) => {
      if (!stompClientRef.current || !stompClientRef.current.connected) return;

      stompClientRef.current.publish({
        destination: '/app/chat.typing',
        body: JSON.stringify({
          sender: currentUser.username,
          recipient: recipientUsername || 'public',
          messageType: 'TYPING',
          timestamp: new Date().toISOString(),
        }),
      });
    },
    [currentUser?.username]
  );

  return {
    connected,
    publicMessages,
    privateMessages,
    typingUsers,
    onlineUsers,
    sendPublicMessage,
    sendPrivateMessage,
    sendTyping,
  };
};
