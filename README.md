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
# 1. Copy environment file and modify variables for your environment
cp .env.example .env
# Edit .env file and update the variables according to your specifications:
# - MYSQL_ROOT_PASSWORD (database root password)
# - MYSQL_DATABASE (database name)
# - JWT_SECRET (your secret key for JWT tokens)
# - Other environment variables as needed

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

[**Click here to watch the demo**](https://drive.google.com/file/d/1qkfBSaQVM5cNB7zJg2ZVhsJV4rTsnlav/view?usp=sharing)

---

**Mohamed El Mostafi - Hahn Software Morocco Internship 2026**
