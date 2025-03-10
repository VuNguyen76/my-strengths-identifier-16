
# Spa Management System

This application consists of a React frontend and a Java Spring Boot backend with SQLite database.

## Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- NPM or Yarn
- Maven (or use the included Maven wrapper)

## Project Structure

- `/be` - Contains the Spring Boot backend
- `/src` - Contains the React frontend

## Running the Application

### Option 1: Use the run script (Linux/Mac)

Make the script executable first:

```bash
chmod +x run.sh
```

Then run it:

```bash
./run.sh
```

### Option 2: Run Backend and Frontend separately

#### Backend:

```bash
cd be
./mvnw spring-boot:run
```

The backend will start on http://localhost:8081/api

#### Frontend:

```bash
npm install (first time only)
npm run dev
```

The frontend will start on http://localhost:8080

## API Documentation

Once the backend is running, you can access the Swagger UI at:

http://localhost:8081/api/swagger-ui

## Default Admin Account

Username: admin
Password: admin123

## Default Staff Account

Username: staff
Password: staff123

## Database

The application uses SQLite, so no external database setup is required. The database file will be created automatically in the root directory as `spa.db`.

## Features

- User authentication with JWT
- Role-based access control
- Service booking and management
- Staff and specialist management
- Transaction tracking
- Reports and analytics

## Notes

- The frontend and backend are completely decoupled
- All API requests from the frontend to the backend include the JWT token for authentication
- Database is SQLite for easy portability and setup
