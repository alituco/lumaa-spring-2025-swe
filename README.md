Ali Altaraif
aebrahi7@asu.edu
https://www.alialtaraif.tech


# Task Management App – How to use

## 1. Database Setup
You can install PostgreSQL locally or run it via Docker. For Docker, run:
```bash
docker run --name nest-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=task_management_db \
  -p 5432:5432 \
  -d postgres
```
  
## 2. Backend Setup
Refer to the .env.example in /backend and set the env variables accordingly

## 3. Running the backend
```bash
cd backend
npm install
npm run start:dev
```

## 4. Frontend Setup
Refer to the .env.example in /frontend and set the env variables accordingly

## 5. Running the frontend
```bash
cd frontend
npm install
npm run dev
```

# 6. Running Migrations

  a. Generate the migration:
  ```bash
  cd backend
  npm run migration:generate -- ./src/migrations/InitialMigration

  b. Run migrations:
  ```bash
  cd backend
  npm run migration:run
