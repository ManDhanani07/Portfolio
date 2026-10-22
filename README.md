# Full-Stack Task Management & Portfolio Platform

[![CI Pipeline](https://github.com/ManDhanani07/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/ManDhanani07/Portfolio/actions/workflows/ci.yml)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)
![Jest](https://img.shields.io/badge/Tested%20with-Jest%20%26%20Supertest-red.svg)

A complete full-stack web application featuring an interactive Kanban Task Management system, JWT-based security pipeline, in-memory caching (`node-cache`), performance optimizations (`React.lazy`), and an automated **GitHub Actions CI/CD pipeline**.

---

## 🚀 CI/CD Pipeline Architecture

Every `git push` or `pull request` to the `main` branch automatically triggers our GitHub Actions pipeline:

```
git push origin main
       │
       ▼
GitHub Actions Trigger (on: push)
       │
       ▼
Job: build-and-test (ubuntu-latest)
  ├── 1. Checkout repository code (actions/checkout@v4)
  ├── 2. Set up Node.js v18 (actions/setup-node@v4)
  ├── 3. Install backend dependencies (npm install)
  ├── 4. Run automated tests (npm test with Jest & Supertest)
  ├── 5. Install frontend dependencies (npm install)
  └── 6. Build frontend production bundle (npm run build)
       │
       ▼
Result: ✅ Green Checkmark (Passed) or ❌ Red X (Failed)
```

---

## 🧪 Automated Testing

Automated testing is handled by **Jest** and **Supertest** in `backend/tests/api.test.js`:

```powershell
# Run backend tests
cd backend
npm test

# Run from root workspace
npm test
```

### Verified Test Cases:
1. `GET /` — API health check and endpoint documentation route (200 OK).
2. `GET /api/tasks/cache/stats` — In-memory caching hit/miss stats verification (200 OK).
3. `GET /api/tasks` — Authentication guard verifying `401 Unauthorized` when JWT is missing.
4. `GET /api/nonexistent-route` — Global 404 route handler verification (404 Not Found).

---

## 🛠️ Local Development

### Backend Setup
```powershell
cd backend
npm install
npm run dev
```

### Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```

---

## 📦 Production Build
```powershell
# Build frontend with route-based code-splitting
cd frontend
npm run build
```
