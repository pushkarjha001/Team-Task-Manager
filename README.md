# Team Task Manager

Full-stack Team Task Manager assignment with authentication, role-based access, project/team management, task assignment, status tracking, and dashboard metrics.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Java 17, Spring Boot, Spring Security, Spring Data JPA
- Database: H2 locally, PostgreSQL on Railway
- Auth: JWT

## Project Structure

```text
team-task-manager/
├── frontend/
└── backend/
    └── team-task-manager-backend/
```

---

## Local Setup

### Backend

```powershell
cd backend\team-task-manager-backend
.\mvnw.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

---

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend Local URL:

```text
http://localhost:5173
```

Frontend local env:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Features

- Signup and login
- JWT token storage and authenticated API calls
- Admin/member roles
- Admin project creation
- Admin project member assignment
- Admin task creation and assignment
- Member task viewing and status updates
- Dashboard cards for total, completed, pending, and overdue tasks
- Role-based frontend UI
- Backend role and ownership enforcement

---

## Backend API

### Auth

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Projects

```text
GET  /api/projects
POST /api/projects
GET  /api/projects/{id}
GET  /api/projects/{id}/members
POST /api/projects/{id}/members
```

### Tasks

```text
GET /api/tasks
POST /api/tasks
GET /api/tasks/{id}
PUT /api/tasks/{id}/status
```

### Dashboard

```text
GET /api/dashboard
```

### Users

```text
GET /api/users
```

---

## Railway Deployment

Deploy backend service from the same GitHub repository.

### Backend Service Root Directory

```text
/backend/team-task-manager-backend
```

### Backend Railway Variables

Add a Railway PostgreSQL service, then configure the backend service variables:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DATABASE_DRIVER=org.postgresql.Driver
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_EXPIRATION_MS=86400000
```

### Backend Build Command

```bash
./mvnw clean package -DskipTests
```

### Backend Start Command

```bash
java -jar target/team-task-manager-backend-0.0.1-SNAPSHOT.jar
```

---

## Frontend Vercel Deployment

Set this environment variable before deployment:

```env
VITE_API_BASE_URL=https://your-backend-domain.up.railway.app/api
```

Vercel automatically detects and deploys the Vite React application.

---

## Live Demo

### Frontend

```text
https://team-task-manager-bice-nu.vercel.app
```

### Backend

```text
https://team-task-manager-production-44cd.up.railway.app
```

### GitHub Repository

```text
https://github.com/pushkarjha001/Team-Task-Manager
```

---
