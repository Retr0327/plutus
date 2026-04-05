# A Simple Ad-Ops Billing System

This project is a simple ad-ops billing system, featuring a full-stack application with a Next.js frontend and a NestJS backend, utilizing PostgreSQL for data storage. The application is containerized using Docker for easy setup and deployment.

## Prerequisites

**To run the application:**

- **Docker** & **Docker Compose**

**For local development (optional):**
If you wish to run or develop the services outside of Docker, please use the following versions:

- **Node.js**: v22.14.0
- **pnpm**: 10.33.0

## Environment Setup

1. Clone the repository.
2. Create a `.env` file in the root directory based on the provided configuration.

**Important Note on `NODE_ENV`:**

- Set `NODE_ENV="prod"` if you just want to run the application directly (recommended for evaluation).
- Set `NODE_ENV="dev"` if you are doing local development.

Here is an example `.env` file:

```bash
NODE_ENV="prod" # Use "prod" to run directly, or "dev" for development

# ========== frontend ==========
NEXT_PUBLIC_API_PREFIX="/api"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
SERVER_URL="http://nginx"

# ========== backend ==========
# postgres
POSTGRES_USER="ubuntu"
POSTGRES_PASSWORD="ubuntu"
POSTGRES_DB="plutus"
POSTGRES_PORT="5432"
POSTGRES_HOST="localhost"
```

## Running the Application

### 1. Production / Evaluation Mode (Recommended)

The easiest way to build and run the application is using Docker Compose. This will spin up the API, Client, Postgres database, and Nginx reverse proxy.

1. Open your terminal in the root directory of the project.
2. Run the following command to build and start the containers in detached mode:

```bash
docker-compose up -d --build
```

3. Once the containers are up and running, the application will be accessible at:
   - **Frontend**: `http://localhost:3000`
   - **API**: `http://localhost:3000/api` (routed via Nginx)

### 2. Development Mode

If you want to run the application locally for development purposes (e.g., with hot-reloading enabled for the frontend and backend), you can use the development Docker Compose file.

Run the following command:

```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

This setup mounts your local directories into the containers, allowing you to see code changes reflected immediately without having to rebuild the images.

## Architecture Overview

The project is structured into two main components, orchestrated by Docker and Nginx:

- **Client (`/client`)**: A Next.js application serving the frontend UI.
- **API (`/api`)**: A NestJS application serving the backend logic, built with Domain-Driven Design (DDD) and CQRS patterns.
- **PostgreSQL**: The relational database used by the API.
- **Nginx**: Acts as a reverse proxy, routing traffic to either the Next.js client or the NestJS API based on the request path.

For more detailed information about the specific parts of the system, please refer to their respective README files:

- [Backend (API) Documentation](./api/README.md)
- [Frontend (Client) Documentation](./client/README.md)
