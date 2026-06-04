# ShopGrid eCommerce Backend

ShopGrid is a high-performance eCommerce backend application built with **Java Spring Boot 3.x** and designed using clean, layered architecture principles. It exposes RESTful APIs for user authentication, product management, and order processing, integrated with PostgreSQL and Redis caching.

## Tech Stack & Highlights

- **Core Framework:** Java Spring Boot 3.x (Java 21/25)
- **Database:** PostgreSQL (Spring Data JPA / Hibernate)
- **Caching:** Redis / Spring Cache (enables caching for high-read endpoints like product details)
- **Security:** Spring Security & JWT (JSON Web Token) stateless authentication
- **AOP (Aspect-Oriented Programming):** Logger, validation, and performance monitoring aspects
- **Styling & Standards:** Strict field-level `@Autowired` Dependency Injection across all components

---

## Backend Architecture & Packages

The project is structured under `org.shivang.ecommerceapp` with a strict separation of concerns:

- **`config`**: Security filters, JWT authentication, CORS settings, and admin user data seeding.
- **`controller`**: REST controllers exposing endpoints for authentication, order processing, and product catalog operations.
- **`service`**: Core business logic layer, handling transaction management, password hashing, and token generation.
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
- Database query results caching utilizing Spring `@Cacheable`, `@CacheEvict`, and `@Caching` to minimize latency.

### 3. Transactional Order Management
- Order placement validates stock quantity, updates the product stock atomically, and creates the order using Spring `@Transactional` to ensure data consistency.

### 4. Cross-Cutting Concerns (Aspects)
- **Logging Aspect:** Tracks entry and exit of service layer methods.
- **Performance Monitor Aspect:** Records and logs execution duration for service calls.
- **Validation Aspect:** Sanitizes input (e.g., handles negative IDs safely).

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate a user and receive a JWT token

### Products (`/api`)
- `GET /api/products` - List all products (cached)
- `GET /api/product/{id}` - Get product by ID (cached)
- `GET /api/product/{id}/image` - Get product image data
- `POST /api/product` - Add new product (Admin only, evicts cache)
- `PUT /api/product/{id}` - Update product (Admin only, evicts cache)
- `DELETE /api/product/{id}` - Delete product (Admin only, evicts cache)
- `GET /api/products/search?keyword={key}` - Search products (cached)

### Orders (`/api`)
- `POST /api/orders/place` - Place a new order (User only, transactional)
- `GET /api/orders/my-orders` - List my orders (User only)
- `GET /api/orders` - List all orders (Admin only)

---

## Configuration & Getting Started

### Prerequisites
- JDK 21 or later
- PostgreSQL
- Redis Server (optional, for caching)

### Database Configuration
Update the database connection details in `src/main/resources/application.properties` (or `application-local.properties`):
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/EcommerceDb
spring.datasource.username=your_username
spring.datasource.password=your_password
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
