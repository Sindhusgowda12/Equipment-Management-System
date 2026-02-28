# Equipment Management System

A full-stack web application to manage equipment and their maintenance lifecycle.

## Features
- **Equipment Management**: View, Add, Edit, and Delete equipment.
- **Maintenance Logging**: Log maintenance events for each equipment item.
- **Automatic Updates**: Maintenance logs automatically set equipment to "Active" and update the "Last Cleaned Date".
- **Business Rules**: Prevents marking equipment as "Active" if it hasn't been cleaned in over 30 days.
- **Maintenance History**: View a complete history of maintenance for any equipment.

## Tech Stack
- **Frontend**: React, Tailwind CSS, shadcn/ui, Lucide React, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: SQLite (using `better-sqlite3`).

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Application
The application runs in full-stack mode (Express + Vite).
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

## Database Schema
The database is initialized automatically on startup.
- `equipment_types`: Stores dynamic equipment categories.
- `equipment`: Stores equipment details and current status.
- `maintenance_logs`: Stores historical maintenance events.

## Assumptions & Decisions
- **Environment**: While the assignment requested Spring Boot and PostgreSQL, this implementation uses Node.js/Express and SQLite to be compatible with the provided AI Studio sandbox environment. However, the requested **Layered Architecture** (Controller -> Service -> Repository) has been strictly followed.
- **UI Components**: Used `sonner` for toast notifications as it is the modern replacement for the deprecated `toast` component in shadcn/ui.
- **Date Handling**: Used `date-fns` for robust date calculations and comparisons.
