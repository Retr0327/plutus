# Backend

The API is a robust, scalable backend built to handle the core business logic of the application. As a backend engineer, I focused on implementing enterprise-grade architecture patterns to ensure maintainability, testability, and clear separation of concerns.

## Tech Stack

- **Framework**: NestJS (v11)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Architecture Patterns**: Domain-Driven Design (DDD), Command Query Responsibility Segregation (CQRS)

## Architecture & Design Decisions

### Domain-Driven Design (DDD) & Clean Architecture

The application is structured using Clean Architecture principles and Domain-Driven Design. This approach divides the system into distinct layers, preventing business logic from becoming entangled with infrastructure details or framework specifics.

The `src` directory is organized into four main layers:

- **Domain Layer (`domain`)**: Contains the core business entities, value objects, and domain interfaces. This layer is entirely independent of external libraries or frameworks.
- **Application Layer (`application`)**: Contains the use cases and business logic orchestration. It implements the CQRS pattern.
- **Infrastructure Layer (`infrastructure`)**: Handles external concerns such as database persistence (TypeORM repositories), external API integrations, and framework-specific configurations.
- **Presentation Layer (`presentation`)**: Manages incoming HTTP requests (Controllers) and translates them into commands or queries for the application layer.

This separation makes the codebase highly scalable, allowing different teams to work on different layers simultaneously and making it easier to swap out infrastructure components (like the database or web framework) without affecting the core business rules.

### CQRS Pattern

I implemented the Command Query Responsibility Segregation (CQRS) pattern using `@nestjs/cqrs`. This architectural decision separates the operations that read data (Queries) from the operations that mutate data (Commands).

**Benefits achieved:**

- **Scalability**: Read and write workloads can be scaled independently if needed in the future.
- **Maintainability**: Complex business logic is broken down into smaller, focused Command Handlers and Query Handlers, making the code easier to understand and test.
- **Flexibility**: Different data models can be used for reading and writing, optimizing performance for each specific task.

### Trade-offs

While DDD and CQRS provide significant long-term benefits, they come with trade-offs:

- **Increased Initial Complexity**: These patterns introduce more boilerplate code (Commands, Queries, Handlers, Repositories, etc.) compared to a traditional MVC architecture.
- **Learning Curve**: It requires a deeper understanding of architectural concepts, which can slow down initial development speed.

However, for a project expected to grow in complexity, the investment in a solid architectural foundation pays off by preventing the codebase from becoming a "big ball of mud." The clear domain boundaries and decoupled layers make adding new features and writing unit tests significantly easier.

## Core Domain Modules

The application's business logic is divided into distinct bounded contexts within the `domain` layer:

- **`campaign`**: Manages the lifecycle and rules associated with marketing or financial campaigns.
- **`invoice`**: Handles the creation, processing, and tracking of invoices.
- **`audit-log`**: Provides a centralized mechanism for tracking critical system events and state changes for compliance and debugging.
- **`common`**: Contains shared value objects, base entities, and utilities used across multiple domains.

## Code Quality & Standards

To ensure high code quality and consistency, the project adheres to strict coding standards:

- **Strict TypeScript**: Leveraging TypeScript's strict mode to catch potential runtime errors at compile time.
- **Linting & Formatting**: Enforced via ESLint and Prettier.
- **Error Handling**: Consistent and centralized error handling mechanisms to provide meaningful feedback to the client while logging necessary details for debugging.
- **Style Guidelines**: While writing in TypeScript, I conceptually adhered to principles similar to the Uber Go Style Guide (e.g., avoiding global state, minimizing nesting, keeping variable scopes tight, and ensuring consistent naming conventions) to maintain a clean and readable codebase.
