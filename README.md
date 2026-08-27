# IT342 Activity01 — Authenticated Service Request Module

A full-stack app with user authentication (JWT) and a Service Request CRUD module. Users can register, log in, and manage their own service requests — with ownership strictly enforced by the Spring Boot backend, not just hidden in the UI.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Spring Boot REST API
- **Security:** Spring Security + JWT (JJWT library)
- **Database:** MySQL

## Project Structure
    activity01/
    backend/ Spring Boot API (Java, Maven)
    frontend/ React + Vite app
-----------------------------------------------------------------

## Prerequisites

- Java 17+ and Maven
- Node.js and npm
- MySQL server running locally

## Backend Setup

1. Create a MySQL database named `activity01db`.
2. Open `backend/src/main/resources/application.properties` and set your MySQL connection details:
    spring.datasource.url=jdbc:mysql://127.0.0.1:<your-port>/activity01db
    spring.datasource.username=<your-username>
    spring.datasource.password=<your-password>
3. From the `backend/` folder, run the app (or open it in IntelliJ and run `Activity01Application`):
    cd backend
    mvn spring-boot:run
4. The API will be available at `http://localhost:8080`. Tables are auto-created on first run via Hibernate.

## Frontend Setup
    cd frontend
    npm install
    npm run dev


Opens at `http://localhost:5173`. Make sure the backend is running first — the frontend calls it directly at `http://localhost:8080/api`.

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|----------------|-------------|
| POST | `/api/register` | No | Register a new user |
| POST | `/api/login` | No | Log in, returns a JWT |
| GET | `/api/user/{id}` | No | Get a user's public profile |
| POST | `/api/requests` | Yes | Create a service request |
| GET | `/api/requests` | Yes | List the current user's own requests |
| GET | `/api/requests/{id}` | Yes | Get one request (owner only) |
| PUT | `/api/requests/{id}` | Yes | Update a request (owner only) |
| DELETE | `/api/requests/{id}` | Yes | Delete a request (owner only) |

Protected endpoints require an `Authorization: Bearer <token>` header, using the token returned from `/api/login`.

## Security Notes

- Passwords are hashed with BCrypt and never returned in any API response.
- Ownership of a Service Request is determined server-side from the authenticated JWT (`Authentication.getName()`) — never from a client-supplied `userId`.
- Attempting to view, update, or delete another user's request returns `403 Forbidden`.