# Team Task Manager Frontend

This is the frontend app for the Team Task Manager project.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app locally:
   ```bash
   npm run dev
   ```
3. Open the frontend at the provided Vite URL.

## Backend integration

- The app uses `src/api/axios.ts` to call API endpoints.
- API base URL is configured with `VITE_API_URL` in `.env`.
- Default backend URL is `http://localhost:8080`.

## Features included

- Login page
- Signup page
- Dashboard page
- Projects page
- Tasks page
- Auth token storage in `localStorage`
- Protected routes for dashboard, projects, and tasks

## Notes

- The frontend is ready to connect with a Spring Boot backend.
- When backend is available, confirm endpoint paths like `/auth/login`, `/auth/signup`, `/dashboard`, `/projects`, and `/tasks`.
