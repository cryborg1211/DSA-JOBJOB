# 🚀 JobJob — DSA-Powered Recruitment Platform

A full-stack recruitment platform where **Candidates swipe Jobs** and **Recruiters swipe Resumes**, with matching scores powered by a custom Java DSA engine (Trie · Cosine Similarity · Max-Heap).

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Local Development — Quick Start](#local-development--quick-start)
   - [Backend (Spring Boot)](#1-backend-spring-boot)
   - [Frontend (React + Vite)](#2-frontend-react--vite)
5. [Environment Variables](#environment-variables)
6. [Application Routes](#application-routes)
7. [API Contract Reference](#api-contract-reference)
8. [🔴 Mock Data Guide for Backend Developers](#-mock-data-guide-for-backend-developers)
9. [Architecture Overview](#architecture-overview)
10. [Production Build & Deployment](#production-build--deployment)

---

## Project Structure

```
DSA-JOBJOB/
├── jobjob-backend/          # Spring Boot 3 · Java 21 · Maven
│   └── src/main/java/com/jobjob/
│       ├── controller/      # REST endpoints
│       ├── service/
│       │   └── MatchingService.java   # DSA orchestrator (Trie + Cosine + Heap)
│       └── dsa/
│           ├── trie/        # JobTrie — prefix search
│           ├── similarity/  # CosineSimilarity engine
│           └── heap/        # RankingHeap — Max-Heap ranker
│
└── jobjob-frontend/         # React 19 · Vite 7 · TypeScript · Tailwind v4
    └── src/
        ├── features/
        │   ├── auth/        # LoginPage, RoleSelectionPage, ProfilePage
        │   └── matching/
        │       ├── MatchDashboard.tsx   # Swipe UI orchestrator
        │       └── SwipeCard.tsx        # Framer Motion drag card
        ├── components/
        │   ├── layout/      # Navbar
        │   └── dsa-visuals/ # RankingList, SimilarityRadar, TrieSearchInput
        ├── hooks/
        │   └── useMatchEngine.ts        # Calls matchService, updates store
        ├── services/        # Axios API layer (api.ts, authService, jobService, matchService)
        ├── store/           # Zustand stores (authStore, matchStore)
        ├── types/           # TypeScript interfaces (match.ts, job.ts, candidate.ts)
        └── styles/
            └── index.css    # Design tokens + global utility classes
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 + Vanilla CSS design tokens |
| Animation | Framer Motion 12 |
| State management | Zustand 5 |
| HTTP client | Axios 1 |
| Icons | Lucide React |
| Backend framework | Spring Boot 3.2 |
| Language | Java 21 |
| Security | Spring Security + JJWT 0.12 |
| Database | MySQL (via Spring Data JPA) |
| Build tool | Maven |

---

## Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Java JDK | 21 | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| MySQL | 8.0+ | `mysql --version` |

---

## Local Development — Quick Start

### 1. Backend (Spring Boot)

#### a. Create the MySQL database

```sql
CREATE DATABASE jobjob;
CREATE USER 'jobjob_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON jobjob.* TO 'jobjob_user'@'localhost';
FLUSH PRIVILEGES;
```

#### b. Configure `application.properties`

Create (or edit) `jobjob-backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/jobjob?useSSL=false&serverTimezone=UTC
spring.datasource.username=jobjob_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=your_256_bit_secret_key_here_change_in_production
jwt.expiration-ms=86400000
```

#### c. Run the backend

```bash
cd jobjob-backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

### 2. Frontend (React + Vite)

```bash
cd jobjob-frontend
npm install
npm run dev
```

The app will be available at **`http://localhost:5173`**.

> **Proxy**: All `/api/*` requests from the frontend are automatically proxied to `http://localhost:8080` via `vite.config.ts`. No CORS configuration is needed during development.

---

## Environment Variables

The frontend reads no `.env` file by default — the proxy in `vite.config.ts` handles the backend URL. For production, set the `VITE_API_BASE_URL` variable and update `src/services/api.ts` accordingly.

The backend reads configuration from `application.properties` (see above). Do **not** commit secrets — use environment variable injection in CI/CD:

```bash
SPRING_DATASOURCE_PASSWORD=secret mvn spring-boot:run
```

---

## Application Routes

| Path | Component | Auth Required |
|---|---|---|
| `/login` | `LoginPage` | No |
| `/register` | `LoginPage` (register mode) | No |
| `/select-role` | `RoleSelectionPage` | Yes |
| `/profile-setup` | `ProfilePage` | Yes |
| `/dashboard` | `MatchDashboard` (Swipe UI) | Yes |
| `/match` | `MatchDashboard` (alias) | Yes |

**Auth guard**: A `PrivateRoute` wrapper checks the Zustand `authStore` for a JWT token. If missing, it redirects to `/login`.

---

## API Contract Reference

All endpoints are prefixed with `/api`. The JWT Bearer token must be included in the `Authorization` header for all protected routes.

### Auth

| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/auth/login` | `{ username, password }` | `{ token, role }` |
| `POST` | `/api/auth/register` | `{ username, password, role }` | `{ message }` |

### Jobs

| Method | Endpoint | Params / Body | Response |
|---|---|---|---|
| `GET` | `/api/jobs` | — | `Job[]` |
| `GET` | `/api/jobs/:id` | — | `Job` |
| `GET` | `/api/jobs/suggest` | `?prefix=<string>` | `string[]` (Trie suggestions) |
| `POST` | `/api/jobs` | `JdDraft` body | `Job` |
| `PUT` | `/api/jobs/:id` | `Partial<JdDraft>` body | `Job` |
| `DELETE` | `/api/jobs/:id` | — | `204` |

### Matching (DSA Engine)

| Method | Endpoint | Params / Body | Response |
|---|---|---|---|
| `POST` | `/api/match/compare` | `{ candidateId, jobId }` | `MatchResult` |
| `GET` | `/api/match/rank` | `?candidateId=<id>` | `RankedJob[]` |
| `GET` | `/api/match/rank` | `?jobId=<id>` | `RankedJob[]` (for recruiters) |

#### `MatchResult` shape (TypeScript)

```ts
interface MatchResult {
  jobId: string;
  candidateId: string;
  overallScore: number;       // 0–100
  breakdown: {
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  extraSkills: string[];
  cvVector: Record<string, number>;
  jdVector: Record<string, number>;
}
```

#### `RankedJob` shape

```ts
interface RankedJob {
  rank: number;
  jobId: string;
  jobTitle: string;
  companyName: string;
  score: number;   // 0–100
}
```

#### `SwipeCardData` shape (new — for the swipe deck endpoint)

```ts
interface SwipeCardData {
  id: string;
  type: 'JOB' | 'CANDIDATE';
  avatarUrl?: string;
  title: string;       // Job title OR Candidate full name
  subtitle: string;    // Company name OR latest role + location
  skills: string[];
  score: number;       // 0–100, from DSA Cosine engine
  description?: string;
}
```

---

## 🔴 Mock Data Guide for Backend Developers

The frontend currently uses **hardcoded mock data** in several places while the backend API is being built. Every mock is clearly marked with a `// TODO: replace with real API call` comment pattern. Below is the complete list.

---

### 1. Swipe Card Deck

**📁 File:** `jobjob-frontend/src/features/matching/MatchDashboard.tsx`
**Lines:** `MOCK_JOB_CARDS` (lines ~14–45) and `MOCK_CANDIDATE_CARDS` (lines ~47–76)

These are the cards shown in the swipe UI. They are loaded into the `matchStore.swipeCards` deck on mount.

**What the backend must provide:**

- A new endpoint: `GET /api/match/swipe-deck`
  - Query param: `role=CANDIDATE` → returns `SwipeCardData[]` of type `'JOB'`
  - Query param: `role=RECRUITER` → returns `SwipeCardData[]` of type `'CANDIDATE'`
  - The `score` field must be pre-computed by `MatchingService.compareVectors()` for the authenticated user
  - Recommended page size: 10–20 cards per call (implement infinite-load later)

**Replacement location in code:**

```ts
// In MatchDashboard.tsx — useEffect on mount
// REPLACE this:
const deck = role === 'RECRUITER' ? MOCK_CANDIDATE_CARDS : MOCK_JOB_CARDS;
setSwipeCards(deck);

// WITH something like:
const { data } = await matchService.getSwipeDeck(role);
setSwipeCards(data);
```

---

### 2. Candidate ID Placeholder

**📁 File:** `jobjob-frontend/src/features/matching/MatchDashboard.tsx`
**Line:** `const MOCK_CANDIDATE_ID = 'c-001';`

This hardcoded string is passed to `rankJobsForCandidate()`. It should be replaced with the real candidate ID from the authenticated user's profile, which should be stored in `authStore` after login.

**What the backend must include in the JWT payload / login response:**

```json
{ "token": "...", "role": "CANDIDATE", "userId": "actual-db-id" }
```

Then `authStore` should persist `userId` and the component reads `useAuthStore().userId`.

---

### 3. RankingList Mock (Legacy)

**📁 File:** `jobjob-frontend/src/components/dsa-visuals/RankingList.tsx`

This component renders a scored list of jobs. It already receives `jobs: RankedJob[]` as props and is wired to `GET /api/match/rank?candidateId=...`. The mock was only in `MatchDashboard` (now removed from the main view). When you re-introduce this component into a detail view, the real API should work immediately.

---

### 4. TrieSearchInput Suggestions

**📁 File:** `jobjob-frontend/src/components/dsa-visuals/TrieSearchInput.tsx`

Calls `GET /api/jobs/suggest?prefix=<input>`. The backend `MatchingService.suggest(prefix)` and `JobTrie` are already implemented. The Trie must be seeded with job titles — call `MatchingService.rebuildTrie(jobTitles)` on application startup (e.g. via a `@PostConstruct` in a `DataInitializer` bean).

---

### 5. Backend `RankingHeap` — TODO inside MatchingService

**📁 File:** `jobjob-backend/src/main/java/com/jobjob/service/MatchingService.java`
**Line 81:**

```java
// TODO: replace "Title" / "Company" with real DB lookups
rankingHeap.push(new RankingHeap.MatchEntry(jobId, "Job " + jobId, "Company", score * 100));
```

The `jobId` is correct, but job title and company name are placeholder strings. Replace with a `JobRepository.findById(jobId)` call to populate the `MatchEntry` with real data.

---

### Summary Table

| # | File | Line(s) | What to Replace | New API/Source |
|---|---|---|---|---|
| 1 | `MatchDashboard.tsx` | ~14–76 | `MOCK_JOB_CARDS` & `MOCK_CANDIDATE_CARDS` | `GET /api/match/swipe-deck?role=` |
| 2 | `MatchDashboard.tsx` | ~82 | `MOCK_CANDIDATE_ID = 'c-001'` | `authStore.userId` from JWT |
| 3 | `RankingList.tsx` | (props) | Already wired — just needs backend data | `GET /api/match/rank?candidateId=` |
| 4 | `TrieSearchInput.tsx` | (service call) | Already wired — needs Trie seeded at startup | `GET /api/jobs/suggest?prefix=` |
| 5 | `MatchingService.java` | line 81 | `"Job " + jobId`, `"Company"` | `JobRepository.findById(jobId)` |

---

## Architecture Overview

```
Browser (React SPA)
  │
  │  /api/* requests (proxied by Vite in dev, Nginx in prod)
  ▼
Spring Boot REST API  (:8080)
  │
  ├── AuthController     → JWT issue / verify
  ├── JobController      → CRUD + Trie suggestions
  └── MatchController    → Cosine compare + Heap ranking
       │
       └── MatchingService
            ├── JobTrie           (prefix search, O(m))
            ├── CosineSimilarity  (TF-IDF dot product, O(n))
            └── RankingHeap       (Max-Heap drain, O(k log n))
                │
                └── MySQL (JPA entities: User, Job, Candidate)
```

---

## Production Build & Deployment

### Frontend — Build static assets

```bash
cd jobjob-frontend
npm run build
# Output: jobjob-frontend/dist/
```

Serve the `dist/` folder with **Nginx** (recommended). Sample Nginx config:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/jobjob/dist;
    index index.html;

    # SPA fallback — send all routes to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Spring Boot
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Backend — Build JAR

```bash
cd jobjob-backend
mvn clean package -DskipTests
java -jar target/jobjob-backend-0.0.1-SNAPSHOT.jar
```

For production, run the JAR as a systemd service or inside a Docker container:

```dockerfile
FROM eclipse-temurin:21-jre
COPY target/jobjob-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

```bash
docker build -t jobjob-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/jobjob \
  -e SPRING_DATASOURCE_PASSWORD=secret \
  -e JWT_SECRET=your_secret \
  jobjob-backend
```

---

> **Last updated:** 2026-02-24 · **Team:** DSA-JOBJOB
