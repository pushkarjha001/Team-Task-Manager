# Team Task Manager Backend

Spring Boot REST API for a team task management app with authentication, project/team management, task assignment, status tracking, dashboard aggregation, and role-based access control.

## Tech Stack

- Java 17
- Spring Boot 3.5
- Spring Web
- Spring Security
- Spring Data JPA
- JWT authentication
- H2 for local development
- PostgreSQL for Railway deployment
- Maven wrapper

## Roles

- `ADMIN`
  - Create projects
  - Add users to projects
  - Create and assign tasks
  - View all projects and tasks
- `MEMBER`
  - View projects they belong to
  - View visible/assigned tasks
  - Update assigned task status

## Local Setup

From this folder:

```powershell
cd D:\team-task-manager\Backend\team-task-manager-backend
.\mvnw.cmd spring-boot:run
```

The API runs at:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
```

H2 JDBC URL:

```text
jdbc:h2:mem:teamtaskdb
```

## Run Tests

```powershell
.\mvnw.cmd test
```

## Environment Variables

Local defaults are already configured in `src/main/resources/application.properties`.

For Railway/PostgreSQL, configure:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:<port>/<database>
DATABASE_DRIVER=org.postgresql.Driver
DATABASE_USERNAME=<username>
DATABASE_PASSWORD=<password>
JWT_SECRET=<long-random-secret-at-least-32-characters>
JWT_EXPIRATION_MS=86400000
app.cors.allowed-origins=https://your-frontend-domain.up.railway.app
```

If you use Railway PostgreSQL reference variables, set:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
```

## API Endpoints

### Auth

#### Signup

```http
POST /api/auth/signup
```

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

Role can be `ADMIN` or `MEMBER`. If role is omitted, the backend creates a `MEMBER`.

#### Login

```http
POST /api/auth/login
```

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response includes a JWT token:

```json
{
  "token": "jwt-token",
  "id": 1,
  "name": "Admin User",
  "email": "admin@example.com",
  "role": "ADMIN"
}
```

Use the token for protected routes:

```http
Authorization: Bearer <token>
```

#### Current User

```http
GET /api/auth/me
```

### Users

Admin only.

```http
GET /api/users
```

### Projects

#### Create Project

Admin only.

```http
POST /api/projects
```

```json
{
  "name": "Website Redesign",
  "description": "Tasks for the new marketing website"
}
```

#### List Projects

```http
GET /api/projects
```

Admin sees all projects. Members see projects they belong to.

#### Get Project

```http
GET /api/projects/{id}
```

#### Add Member To Project

Admin only.

```http
POST /api/projects/{id}/members
```

```json
{
  "userId": 2
}
```

#### List Project Members

```http
GET /api/projects/{id}/members
```

### Tasks

#### Create Task

Admin only. Assigned user must already be a member of the selected project.

```http
POST /api/tasks
```

```json
{
  "title": "Build dashboard cards",
  "description": "Show total, completed, pending, and overdue tasks",
  "dueDate": "2026-05-20",
  "assignedUserId": 2,
  "projectId": 1
}
```

#### List Tasks

```http
GET /api/tasks
```

Admin sees all tasks. Members see visible/assigned tasks.

#### Get Task

```http
GET /api/tasks/{id}
```

#### Update Task Status

Admin or assigned member.

```http
PUT /api/tasks/{id}/status
```

```json
{
  "status": "IN_PROGRESS"
}
```

Allowed statuses:

```text
TODO
IN_PROGRESS
DONE
```

### Dashboard

```http
GET /api/dashboard
```

Example response:

```json
{
  "totalTasks": 10,
  "completed": 4,
  "pending": 6,
  "overdue": 2
}
```

## Suggested Postman Flow

1. Signup an admin.
2. Signup a member.
3. Login as admin and copy the token.
4. Create a project.
5. Add the member to the project.
6. Create a task assigned to the member.
7. Login as member and copy the token.
8. Update the assigned task status.
9. Check `/api/dashboard`.
10. Confirm member cannot create a project.

## Railway Notes

Use the Maven wrapper for build/start.

Build command:

```text
./mvnw clean package -DskipTests
```

Start command:

```text
java -jar target/team-task-manager-backend-0.0.1-SNAPSHOT.jar
```

Add a PostgreSQL service in Railway and map its connection values to the environment variables listed above.
