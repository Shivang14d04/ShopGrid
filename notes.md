# ShopGrid Notes

This file is a codebase-backed study guide for the current repository snapshot.
It is based on the actual source under `EcommerceApp/`, not the README claims.

## 1. What This Project Is

ShopGrid is a Spring Boot backend for an e-commerce application.
It implements:

- JWT-based authentication
- role-based authorization
- product CRUD with image upload
- product search
- order placement and order history
- Redis-backed caching for product reads and search
- AI product-description generation through Google Gemini
- a chatbot with semantic retrieval using Spring AI + PostgreSQL pgvector
- AOP logging, timing, and one small argument-normalization aspect

There is no real frontend code in this snapshot.
`Ecommerce-Frontend/t-ecom` exists, but it is empty in the repository state I inspected.

## 2. Tech Stack Actually Present

### Build and runtime

- Java 21
- Spring Boot 4.1.0
- Maven
- Docker

### Web and API

- Spring WebMVC
- Jackson
- REST controllers

### Security

- Spring Security
- JWT via `jjwt`
- BCrypt password hashing

### Persistence

- Spring Data JPA
- Hibernate
- PostgreSQL

### Caching

- Spring Cache
- Redis starter

### AI / Vector search

- Spring AI
- Google Gemini chat model
- Google Gemini embedding model
- Spring AI pgvector store
- PostgreSQL `vector` extension

### Cross-cutting

- Spring AOP
- SLF4J logging
- Lombok

## 3. Repository Layout

```text
EcommerceApp/
  pom.xml
  Dockerfile
  src/main/java/org/shivang/ecommerceapp/
    aop/
    config/
    controller/
    exception/
    model/
    model/dto/
    repo/
    service/
  src/main/resources/
    application.properties
    application-local.properties
    application-prod.properties
    init/schema.sql
    prompts/chatbot-rag-prompt.st
```

### Package responsibilities

- `controller`: HTTP endpoints only
- `service`: business logic
- `repo`: JPA repositories
- `model`: entities and security principal
- `model/dto`: request and response records
- `config`: security, admin seeding, AI beans
- `aop`: logging/performance/validation aspects
- `exception`: global auth/user-conflict handling

## 4. Important Classes

### Boot class

- `EcommerceAppApplication`
  - File: `EcommerceApp/src/main/java/org/shivang/ecommerceapp/EcommerceAppApplication.java`
  - Annotation: `@SpringBootApplication`, `@EnableCaching`
  - Starts the app and enables Spring Cache

### Security

- `SecurityConfig`
  - File: `config/SecurityConfig.java`
  - Sets stateless JWT security
  - Public routes:
    - `/api/auth/**`
    - `/error`
    - `/api/chat/**`
    - `GET /api/products`
    - `GET /api/products/search`
    - `GET /api/product/**`
  - Protected routes:
    - admin product writes
    - user order placement and order history

- `JwtAuthenticationFilter`
  - File: `config/JwtAuthenticationFilter.java`
  - Reads `Authorization: Bearer <token>`
  - Extracts username
  - Loads user from DB
  - Validates token
  - Populates `SecurityContextHolder`

- `CustomUserDetailsService`
  - File: `service/CustomUserDetailsService.java`
  - Loads `User` by username from `UserRepository`

- `JwtService`
  - File: `service/JwtService.java`
  - Generates and validates HS256 tokens
  - Uses `app.jwt.secret` and `app.jwt.expiration-ms`

### Business services

- `AuthenticationService`
  - Register and login
  - Hashes passwords with BCrypt
  - Uses `AuthenticationManager` for login
  - Returns JWT on success

- `ProductService`
  - Product read/write/search
  - Spring Cache annotations
  - Writes product documents to vector store
  - Generates descriptions with Gemini

- `OrderService`
  - Places orders transactionally
  - Pulls current authenticated user from `SecurityContextHolder`
  - Deducts stock
  - Saves order and order items
  - Updates vector store with product and order summaries

- `ChatBotService`
  - Loads prompt template from `classpath:prompts/chatbot-rag-prompt.st`
  - Uses vector similarity search for context
  - Sends context + message to Gemini through `ChatClient`

### Controllers

- `AuthenticationController`
  - `POST /api/auth/register`
  - `POST /api/auth/login`

- `ProductController`
  - `GET /api/products`
  - `GET /api/product/{id}`
  - `GET /api/product/{productId}/image`
  - `POST /api/product`
  - `PUT /api/product/{id}`
  - `DELETE /api/product/{id}`
  - `POST /api/product/generate-description`
  - `GET /api/products/search`

- `OrderController`
  - `POST /api/orders/place`
  - `GET /api/orders`
  - `GET /api/orders/my-orders`

- `ChatBotController`
  - `POST /api/chat/ask`

## 5. Entities and Relationships

### `User`

- File: `model/User.java`
- Table: `users`
- Fields:
  - `id`
  - `username`
  - `email`
  - `password`
  - `role`
  - `enabled`
  - `createdAt`
- Implements `UserDetails`
- `getAuthorities()` returns `ROLE_ADMIN` or `ROLE_USER`

### `Product`

- File: `model/Product.java`
- Fields:
  - `id`
  - `name`
  - `description`
  - `brand`
  - `price`
  - `category`
  - `releaseDate`
  - `productAvailable`
  - `stockQuantity`
  - `imageName`
  - `imageType`
  - `imageData`

### `Order`

- File: `model/Order.java`
- Table name is `orders` via `@Entity(name="orders")`
- Fields:
  - `id`
  - `orderId`
  - `customerName`
  - `email`
  - `status`
  - `orderDate`
  - `user`
  - `orderItems`
- Relations:
  - many orders to one user
  - one order to many order items

### `OrderItem`

- File: `model/OrderItem.java`
- Fields:
  - `id`
  - `product`
  - `quantity`
  - `totalPrice`
  - `order`

### Relationship map

```text
User 1:N Order
Order 1:N OrderItem
Product 1:N OrderItem
```

## 6. DTOs

DTO records found in `model/dto/`:

- `LoginRequest(username, password)`
- `RegisterRequest(username, email, password)`
- `AuthenticationResponse(token)`
- `OrderItemRequest(productId, quantity)`
- `OrderRequest(customerName, email, items)`
- `OrderItemResponse(productName, quantity, totalPrice)`
- `OrderResponse(orderId, customerName, email, status, orderDate, items)`
- `ChatRequest(message, conversationId)`
- `ChatResponse(reply, conversationId)`

There are no Bean Validation annotations on these DTOs in this codebase snapshot.
Validation is manual in controller/service methods.

## 7. Endpoint Summary

### Public

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/product/{id}`
- `GET /api/product/{productId}/image`
- `GET /api/products/search`
- `POST /api/chat/ask`

### Admin only

- `POST /api/product`
- `PUT /api/product/{id}`
- `DELETE /api/product/{id}`
- `POST /api/product/generate-description`
- `GET /api/orders`

### User only

- `POST /api/orders/place`
- `GET /api/orders/my-orders`

## 8. Request Flow Patterns

### Login

```text
Client
  ↓
POST /api/auth/login
  ↓
AuthenticationController.login
  ↓
AuthenticationService.login
  ↓
AuthenticationManager
  ↓
CustomUserDetailsService
  ↓
UserRepository
  ↓
PostgreSQL
  ↓
BCrypt password check
  ↓
JwtService.generateToken
  ↓
AuthenticationResponse(token)
```

### Product read

```text
Client
  ↓
GET /api/product/{id}
  ↓
ProductController.getProductById
  ↓
ProductService.getProductById
  ↓
Spring Cache
  ↓
ProductRepo
  ↓
PostgreSQL
```

### Order placement

```text
Client
  ↓
POST /api/orders/place
  ↓
OrderController.placeOrder
  ↓
OrderService.placeOrder
  ↓
SecurityContextHolder current user
  ↓
ProductRepo
  ↓
PostgreSQL stock update
  ↓
OrderRepo.save
  ↓
PostgreSQL
  ↓
VectorStore update
  ↓
OrderResponse
```

### Chatbot

```text
Client
  ↓
POST /api/chat/ask
  ↓
ChatBotController.askBot
  ↓
ChatBotService.getBotResponse
  ↓
VectorStore.similaritySearch
  ↓
Prompt template + context
  ↓
Gemini ChatClient
  ↓
ChatResponse
```

## 9. Redis / Cache

Actual cached methods:

- `ProductService.getProductById`
- `ProductService.getAllProducts`
- `ProductService.searchProducts`

Actual cache invalidation:

- `addOrUpdateProduct`
- `deleteProduct`

What is not present:

- no `RedisTemplate`
- no explicit TTL
- no custom cache serializer
- no `CacheManager` bean

So the project uses Spring Cache annotations, backed by Redis starter and profile config.

## 10. AI / Vector Store

### Product description generation

- File: `ProductService.generateDescription`
- Uses Gemini chat model through `ChatClient`
- Builds a prompt from product name and category
- Returns plain text description

### Chatbot

- File: `ChatBotService.getBotResponse`
- Loads prompt template from `src/main/resources/prompts/chatbot-rag-prompt.st`
- Retrieves top similar documents from vector store
- Passes `{context}` into the prompt
- Uses conversation ID with `MessageChatMemoryAdvisor`

### Vector store

`src/main/resources/init/schema.sql` creates:

```text
vector_store(
  id TEXT PRIMARY KEY,
  content TEXT,
  metadata JSONB,
  embedding VECTOR(768)
)
```

It also creates an HNSW cosine index on `embedding`.

Product and order documents are written into the vector store from:

- `ProductService.addOrUpdateProduct`
- `OrderService.placeOrder`

## 11. AOP

Three aspects exist:

- `LoggingAspect`
  - `@Before`, `@After`, `@AfterThrowing`, `@AfterReturning`
  - Targets all `service.*.*(..)` methods

- `PerformanceMonitoringAspect`
  - `@Around`
  - Logs time taken for all service methods

- `ValidationAspect`
  - `@Around`
  - Targets `ProductService.getProductById(..)`
  - Converts negative IDs to positive IDs

## 12. Exception Handling

Global handler:

- `GlobalExceptionHandler`
  - maps `UserAlreadyExistsException` to 409
  - maps `BadCredentialsException` and `UsernameNotFoundException` to 401

Other errors are handled locally with `ResponseStatusException` or controller-level try/catch.

## 13. Configuration Files

### `application.properties`

- sets app name
- sets profiles active twice
- sets local Redis host/port
- enables JPA `ddl-auto=update`
- disables SQL logging

Important note:
- the file has two `spring.profiles.active` lines
- the later one wins in practice

### `application-local.properties`

- localhost PostgreSQL
- localhost Redis
- JWT secret
- admin seed defaults
- Gemini config
- schema initialization
- multipart size limits

### `application-prod.properties`

- Supabase PostgreSQL pooler
- Upstash Redis
- JWT secret and admin defaults from env
- Gemini config from env
- schema initialization
- multipart size limits

### `schema.sql`

- enables `vector` and `hstore`
- creates `vector_store`
- creates HNSW cosine index

## 14. Docker

`EcommerceApp/Dockerfile` is a two-stage build:

1. Maven build stage on Temurin 21
2. Runtime stage on Temurin 21 JRE

It runs the app with:

```text
-Dspring.profiles.active=prod
```

## 15. Missing or Not Verified

These are not present in the inspected codebase:

- payment service/integration
- cart module
- email service
- actuator endpoints
- custom Redis TTL configuration
- `@Valid` / Bean Validation annotations
- frontend application code
- docker-compose
- render/vercel deployment manifests

## 16. Interview Summary

If you are asked to explain the project:

- say it is a layered Spring Boot e-commerce backend
- emphasize JWT auth, role-based access, Redis caching, JPA, and AI features
- describe product read caching, product write invalidation, order transactions, and chatbot RAG
- point out that the chatbot uses vector search over PostgreSQL pgvector
- mention the actual limitations honestly:
  - no frontend in this snapshot
  - no Bean Validation
  - no custom Redis TTL
  - no payment/cart subsystem

## 17. Key Files to Open First

- `pom.xml`
- `src/main/resources/application-local.properties`
- `src/main/resources/application-prod.properties`
- `src/main/java/org/shivang/ecommerceapp/config/SecurityConfig.java`
- `src/main/java/org/shivang/ecommerceapp/service/AuthenticationService.java`
- `src/main/java/org/shivang/ecommerceapp/service/ProductService.java`
- `src/main/java/org/shivang/ecommerceapp/service/OrderService.java`
- `src/main/java/org/shivang/ecommerceapp/service/ChatBotService.java`
- `src/main/resources/init/schema.sql`

