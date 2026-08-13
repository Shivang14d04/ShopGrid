# ShopGrid eCommerce Backend

ShopGrid is a high-performance eCommerce backend application built with **Java Spring Boot 3.x** and designed using clean, layered architecture principles. It exposes RESTful APIs for user authentication, product management, order processing, and features intelligent AI integrations powered by Google Gemini and PgVector, alongside robust Redis caching.

## Tech Stack & Highlights

- **Core Framework:** Java Spring Boot 3.x (Java 21/25)
- **Database:** PostgreSQL with `pgvector` extension (Spring Data JPA / Hibernate)
- **Caching:** Redis / Spring Cache (enables caching for high-read endpoints like product details)
- **AI Integration:** Google Gemini GenAI (Chat & Embeddings) via Spring AI
- **Security:** Spring Security & JWT (JSON Web Token) stateless authentication
- **AOP (Aspect-Oriented Programming):** Logger, validation, and performance monitoring aspects
- **Styling & Standards:** Strict field-level `@Autowired` Dependency Injection across all components

---

## Backend Architecture & Packages

The project is structured under `org.shivang.ecommerceapp` with a strict separation of concerns:

- **`config`**: Security filters, JWT authentication, CORS settings, and admin user data seeding.
- **`controller`**: REST controllers exposing endpoints for authentication, order processing, product catalog, and AI chatbot interactions.
- **`service`**: Core business logic layer, handling transaction management, password hashing, token generation, and AI RAG pipelines.
- **`repo`**: Repository interfaces extending `JpaRepository` for data access.
- **`model`**: JPA Entities and DTO structures mapping to database schemas.
- **`aop`**: Aspect classes managing system logger, input validation, and execution-time monitoring.
- **`exception`**: Global error handling using `@RestControllerAdvice`.

---

## Core Features

### 1. Security & Authentication
- Stateless JWT authentication via `JwtAuthenticationFilter`.
- Password hashing using `BCryptPasswordEncoder`.
- Role-based authorization (`ROLE_ADMIN` vs `ROLE_USER`):
  - **Admin:** Add, update, and delete products; view all orders.
  - **User:** View products, place orders, and view order history.
- Automatic seeding of an admin account on startup if configured.

### 2. Product Catalog & Caching
- Complete CRUD operations for products (including image upload support via multipart requests).
- Database query results caching utilizing Spring `@Cacheable`, `@CacheEvict`, and `@Caching` backed by **Redis** to minimize latency on high-read endpoints.

### 3. Transactional Order Management
- Order placement validates stock quantity, updates the product stock atomically, and creates the order using Spring `@Transactional` to ensure data consistency.

### 4. AI Features & Vector Search (Google Gemini)
- **RAG-Powered Chatbot:** Global interactive AI assistant to help users navigate the store and answer queries based on context.
- **AI-Assisted Content Generation:** Automatically generates product descriptions using Gemini during product creation.
- **Semantic Data Indexing:** Products and order summaries are embedded and synchronized into a PostgreSQL Vector Store (`pgvector`) for contextual retrieval and semantic search.

### 5. Cross-Cutting Concerns (Aspects)
- **Logging Aspect:** Tracks entry and exit of service layer methods.
- **Performance Monitor Aspect:** Records and logs execution duration for service calls.
- **Validation Aspect:** Sanitizes input (e.g., handles negative IDs safely).

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a JWT token

### Products (`/api`)
- `GET /api/products` - List all products (cached via Redis)
- `GET /api/product/{id}` - Get product by ID (cached via Redis)
- `GET /api/product/{id}/image` - Get product image data
- `POST /api/product` - Add new product (Admin only, evicts cache)
- `PUT /api/product/{id}` - Update product (Admin only, evicts cache)
- `DELETE /api/product/{id}` - Delete product (Admin only, evicts cache)
- `GET /api/products/search?keyword={key}` - Search products (cached via Redis)

### Orders (`/api`)
- `POST /api/orders/place` - Place a new order (transactional, updates vector store)
- `GET /api/orders/my-orders` - List my orders (User & Admin)
- `GET /api/orders` - List all orders (Admin only)

### AI & Chat (`/api/chat`)
- `GET /api/chat` - Interact with the Google Gemini RAG chatbot (and similar Chat/AI endpoints)

---

## Configuration & Getting Started

### Prerequisites
- JDK 21 or later
- PostgreSQL (with `pgvector` extension enabled)
- Redis Server (running on localhost:6379)
- Google Gemini API Key

### Configuration
Update the database connection details, Redis config, and AI API keys in `src/main/resources/application.properties` (or `application-local.properties`):
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/EcommerceDb
spring.datasource.username=your_username
spring.datasource.password=your_password

# Redis
spring.data.redis.host=localhost
spring.data.redis.port=6379

# Google Gemini AI
spring.ai.google.genai.api-key=your_google_gemini_api_key
spring.ai.google.genai.chat.model=gemini-3.6-flash
```

### Run Locally
To compile and run the backend application:
```bash
# Navigate to the backend directory
cd EcommerceApp

# Clean and compile
./mvnw clean compile

# Run tests
./mvnw test

# Start the Spring Boot application
./mvnw spring-boot:run
```
