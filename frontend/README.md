# Activity01 — ReactJS Authentication Frontend

A Vite + React frontend that connects to the Spring Boot `activity01` backend
for user registration, login, and a protected dashboard.

## Tech Stack

- React 18 + Vite
- React Router DOM (client-side routing)
- Native `fetch` for API calls
- Spring Boot backend (MySQL + BCrypt password hashing)

## Prerequisites

- Node.js and npm
- The Spring Boot backend running at `http://localhost:8080`

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. The backend's CORS config only allows
requests from `http://localhost:5173` and `http://127.0.0.1:5173`.

## Project Structure


src/
  api/
    authApi.js       ← fetch calls to /api/register, /api/login, /api/user/{id}
    session.js         ← localStorage helpers — stores only id + username, never password
  components/
    ProtectedRoute.jsx
  pages/
    Register.jsx
    Login.jsx
    Dashboard.jsx
  App.jsx
  index.css



  
## Features

- User registration with client-side validation (required fields, email format,
  password length, password confirmation match)
- User login with client-side validation
- Redirect to a protected Dashboard on successful login
- Success and error messages surfaced directly from backend responses
- Navigation between Login and Register pages
- Passwords are never stored client-side, in any form — only held in
  component state during submission

---

## API Data Contract

Base URL: `http://localhost:8080/api`

### 1. Register User

- **Method / URL:** `POST /api/register`
- **Purpose:** Creates a new user account. Password is hashed with BCrypt
  before storage and never returned in any response.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**

| Field    | Type   | Required | Notes                     |
|----------|--------|----------|----------------------------|
| username | string | yes      | Must be unique             |
| email    | string | yes      |                             |
| password | string | yes      | Hashed with BCrypt before saving |

**Sample Request**
```json
POST /api/register
Content-Type: application/json

{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "password": "SecurePass123"
}
```

**Success — 200 OK**
```json
{
  "message": "Registration successful",
  "id": 1,
  "username": "jdoe"
}
```

**Error — 400 Bad Request** (username already taken)
```json
{
  "message": "Username already taken"
}
```

### 2. Login User

- **Method / URL:** `POST /api/login`
- **Purpose:** Authenticates a user by verifying the password against the
  stored BCrypt hash.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**

| Field    | Type   | Required | Notes |
|----------|--------|----------|-------|
| username | string | yes      |       |
| password | string | yes      | Compared via `BCryptPasswordEncoder.matches()` |

**Sample Request**
```json
POST /api/login
Content-Type: application/json

{
  "username": "jdoe",
  "password": "SecurePass123"
}
```

**Success — 200 OK**
```json
{
  "id": 1,
  "username": "jdoe",
  "email": "jdoe@example.com"
}
```

**Error — 404 Not Found**
```json
{
  "message": "User with id 1 not found"
}
```

### Frontend Integration Notes

- All requests are made from `src/api/authApi.js` via `fetch` against
  `http://localhost:8080/api`.
- The backend allows CORS from the Vite dev server origin via a
  `CorsConfig` (`WebMvcConfigurer`) bean — required since frontend (port 5173)
  and backend (port 8080) run on different origins.
- On successful login, only `id` and `username` are stored in `localStorage`
  (key: `activity01_user`) to persist the session across reloads. The
  password is never stored client-side in any form.
- Client-side validation runs before any network request, so invalid
  submissions never reach the backend.
**Success — 200 OK**
```json
{
  "message": "Login successful",
  "id": 1,
  "username": "jdoe"
}
```

**Error — 401 Unauthorized**
```json
{
  "message": "Invalid username or password"
}
```

### 3. Get User by ID

- **Method / URL:** `GET /api/user/{id}`
- **Purpose:** Retrieves a user's public profile by ID. Password is excluded
  from the response.
- **Request Headers:** none required
- **Request Body:** none (path variable only)

**Sample Request**
