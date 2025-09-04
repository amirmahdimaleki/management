# Full-Stack User Profile Management

This is a complete user management application with a Node.js/Express backend and a React/Vite frontend.

## Features

- User Registration and Login with JWT
- Profile Management (Name, Email, Phone, Password)
- Secure OTP Verification for credential changes
- Terms of Service Consent Enforcement
- Session Invalidation on Password Change

## How to Run

1.  **Configure Environment:** Copy `.env.example` to `.env` in the `backend` folder and fill in your database credentials and a `JWT_SECRET`.
2.  **Start Services:** Run `docker compose up -d` from the root directory to start the PostgreSQL and Redis databases.
3.  **Run Backend:** Navigate to the `backend` folder, run `pnpm install`, and then `pnpm dev`.
4.  **Run Frontend:** Navigate to the `frontend` folder, run `pnpm install`, and then `pnpm dev`.
