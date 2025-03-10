
# Spa Management System

This project is a comprehensive Spa Management System with separate frontend and backend.

## Project Structure

The project is organized into two main parts:
- Frontend: React application with TypeScript
- Backend: Spring Boot REST API

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Java 17 or higher
- Maven 3.6+

### Running the Backend

1. Navigate to the backend directory:
```bash
cd be
```

2. Build and run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

Or on Windows:
```bash
mvnw.cmd spring-boot:run
```

The backend will start on http://localhost:8081

### Running the Frontend

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

## Development Guidelines

### Frontend

- The project uses React with TypeScript
- UI components are built using the shadcn/ui library
- Styling is done with Tailwind CSS
- Data fetching is handled by React Query

### Backend

- The backend is built with Spring Boot 3
- Data persistence is handled with JPA/Hibernate and SQLite
- Authentication is implemented using JWT
- API documentation is available through Swagger UI (http://localhost:8081/swagger-ui/index.html)

## Testing

### Frontend

```bash
npm run test
```

### Backend

```bash
cd be
./mvnw test
```

## Building for Production

### Frontend

```bash
npm run build
```

### Backend

```bash
cd be
./mvnw package
```

This will generate a JAR file in the `target` directory that can be deployed.

## API Endpoints

The main API endpoints are:

- Authentication: `/api/auth/*`
- Services: `/api/services/*`
- Specialists: `/api/specialists/*`
- Bookings: `/api/bookings/*`
- Users: `/api/users/*`
- Admin endpoints: `/api/admin/*`

## License

This project is licensed under the MIT License
