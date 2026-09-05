# Real-Time Chat Web Application - Backend (Spring Boot 3 + MySQL)

A production-ready base backend setup for a real-time Chat application built with **Spring Boot 3**, **Spring Data JPA**, **MySQL**, **Spring Security 6**, **JJWT 0.12**, and **Spring WebSocket (STOMP)**.

---

## 🛠 Tech Stack
- **Framework**: Spring Boot 3.3.3
- **Language**: Java 21 / 17
- **Database**: MySQL 8.x
- **ORM / Persistence**: Spring Data JPA & Hibernate
- **Security**: Spring Security 6 + JJWT 0.12.6
- **Real-time Communication**: Spring WebSocket + STOMP / SockJS
- **Boilerplate Reduction**: Project Lombok
- **Build Tool**: Maven

---

## 📁 Package Architecture

```
src/main/java/com/chatapp
├── ChatAppApplication.java          # Spring Boot main application entry point
├── config
│   ├── ApplicationConfig.java       # UserDetailsService, PasswordEncoder, AuthManager
│   ├── GlobalExceptionHandler.java  # RestControllerAdvice for unified JSON error responses
│   ├── JwtAuthenticationFilter.java # OncePerRequestFilter for Bearer JWT validation
│   ├── JwtService.java              # Modern JJWT 0.12 signing, verification, and claims extraction
│   ├── SecurityConfig.java          # SecurityFilterChain & CORS rules
│   └── WebSocketConfig.java         # STOMP / SockJS broker configuration (/ws, /app, /topic, /user)
├── controller
│   ├── AuthController.java          # Public /auth/register, /auth/login, /auth/logout
│   └── UserController.java          # Protected /api/users/me, /api/users/online, /api/users
├── dto
│   ├── AuthResponse.java            # JWT token and user profile response
│   ├── LoginRequest.java            # Login credentials payload
│   ├── RegisterRequest.java         # Registration payload with bean validation
│   └── UserDto.java                 # Public sanitized user profile
├── model
│   ├── ChatMessage.java             # JPA Entity: messages, recipients/roomId, timestamps, type
│   ├── ChatRoom.java                # JPA Entity: room/chat IDs linking sender and recipient
│   ├── MessageType.java             # Enum: CHAT, JOIN, LEAVE, TYPING
│   ├── User.java                    # JPA Entity: UserDetails, credentials, status, lastSeen
│   └── UserStatus.java              # Enum: ONLINE, OFFLINE
├── repository
│   ├── ChatMessageRepository.java   # Custom JPQL and derived query methods
│   ├── ChatRoomRepository.java      # Room lookup queries
│   └── UserRepository.java          # User lookup queries by username, email, and presence
└── service
    ├── AuthService.java             # Registration, password hashing, login token issue, presence
    └── UserService.java             # Profile retrieval, online user queries, presence updates
```

---

## 🗄️ Database Setup (MySQL)

1. Make sure MySQL server is running on `localhost:3306`.
2. The database `chat_db` will be automatically created if it does not exist.
3. You can customize DB credentials in `src/main/resources/application.yml` or via environment variables:
   - `DB_HOST` (default: `localhost`)
   - `DB_PORT` (default: `3306`)
   - `DB_NAME` (default: `chat_db`)
   - `DB_USER` (default: `root`)
   - `DB_PASSWORD` (default: `root`)
4. The exact DDL schema is provided in `src/main/resources/schema.sql`.

---

## 🚀 Running the Application

Using Maven (or your IDE such as IntelliJ IDEA / VS Code / Eclipse):

```bash
mvn spring-boot:run
```

The server will start at: `http://localhost:8080`

---

## 🔌 API Endpoints Reference

### 1. Public Authentication Endpoints (`/auth/**`)

#### Register a New User
- **POST** `/auth/register`
- **Request Body**:
  ```json
  {
    "username": "alex",
    "email": "alex@example.com",
    "password": "Password123!",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "alex",
    "email": "alex@example.com",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    "status": "ONLINE"
  }
  ```

#### Login
- **POST** `/auth/login`
- **Request Body**:
  ```json
  {
    "usernameOrEmail": "alex",
    "password": "Password123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "id": 1,
    "username": "alex",
    "email": "alex@example.com",
    "avatarUrl": "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    "status": "ONLINE"
  }
  ```

#### Logout
- **POST** `/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "message": "User logged out successfully"
  }
  ```

---

### 2. Protected User Endpoints (`/api/**`)
*(Requires header: `Authorization: Bearer <token>`)*

- **GET** `/api/users/me` - Fetch currently authenticated user profile
- **GET** `/api/users/online` - Fetch all currently active users (`ONLINE`)
- **GET** `/api/users` - Fetch list of all registered users

---

### 3. WebSocket Real-Time Endpoint (`/ws`)
- **Handshake URL**: `ws://localhost:8080/ws` (or via SockJS fallback `http://localhost:8080/ws`)
- **Application Destination Prefix**: `/app`
- **Broker Destination Prefixes**:
  - `/topic` - Broadcast channels (e.g., `/topic/public`)
  - `/queue` - Direct messages
  - `/user` - User-specific private queues
