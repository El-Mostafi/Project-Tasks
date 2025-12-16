# Project Tasks Management System

Full-stack application for managing projects and tasks with authentication.

## Tools Used
- **Backend:** Spring Boot 3.5.8 + Java 21
- **Frontend:** React 18 + TypeScript
- **Database:** MySQL 8.0
- **Authentication:** JWT

---

## How to Run with Docker

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access the application
# Frontend: http://localhost
# Backend: http://localhost:8081
```

---

## How to Run Backend

```bash
cd ProjectTasksBackEnd
mvn spring-boot:run
# Runs on http://localhost:8081
```

## How to Run Frontend

```bash
cd ProjectTasksFrontEnd
npm install
npm run dev
# Runs on http://localhost:5173
```

## Database Setup

Create MySQL database:
```sql
CREATE DATABASE project_tasks;
```

Configure in `application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

## Demo Video

[**Click here to watch the demo**](YOUR_VIDEO_LINK_HERE)

---

**Mohamed El Mostafi - Hahn Software Morocco Internship 2026**

