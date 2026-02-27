<div align="center">

# 🚀 JobJob

### A Tinder-Style Recruitment Platform Powered by Custom Data Structures

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-3.x-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)](https://maven.apache.org/)
[![Status](https://img.shields.io/badge/Status-Green_State_%E2%9C%85-brightgreen?style=for-the-badge)](/)

</div>

---

## 📖 Project Overview

**JobJob** is a recruitment platform that reimagines the job-search experience through a **Tinder-style swipe interface**. Instead of passive filtering, candidates and recruiters interact with each other's profiles through swipe cards, driven by an intelligent backend matching engine.

> **Academic Focus:** This project is built as a **Data Structures & Algorithms** exploration. The matching engine is powered entirely by **custom, hand-written implementations** of a Trie, a Max-Heap, and a Cosine Similarity calculator — with zero reliance on Java's built-in priority queue or collection utilities for these core computations.

---

## ✅ Current Milestones — Green State

The project has reached a stable **Green State**, meaning the application compiles cleanly, starts without errors, and all DSA components are wired into the Spring context.

| # | Milestone | Status |
|---|-----------|--------|
| 1 | Project backbone initialized with **Spring Boot 3.2.5** and **Java 17** | ✅ Done |
| 2 | Clean package refactoring to `com.jobjob.*` namespace | ✅ Done |
| 3 | Resolved all Maven / Lombok / Annotation Processor conflicts | ✅ Done |
| 4 | **DSA Engine skeleton** (`Trie`, `MaxHeap`, `CosineSimilarity`) fully integrated | ✅ Done |
| 5 | `MatchingService` wiring all three DSA engines together via Spring DI | ✅ Done |
| 6 | Server live on **port 8080** with Spring Security enabled | ✅ Done |
| 7 | React + Vite frontend scaffolded with Tinder-style swipe UI | ✅ Done |

---

## 🏗️ Architecture

```
DSA-JOBJOB/
├── jobjob-backend/                  # Spring Boot REST API
│   └── src/main/java/com/jobjob/
│       ├── JobJobApplication.java   # Entry point & component scan root
│       ├── controller/
│       │   └── TestController.java  # Health-check endpoint
│       ├── service/
│       │   └── MatchingService.java # Orchestrates all DSA engines
│       └── dsa/                     # ← THE CORE DSA ENGINE
│           ├── trie/
│           │   ├── TrieNode.java    # Node with HashMap children
│           │   └── JobTrie.java     # Prefix-tree for job title search
│           ├── heap/
│           │   ├── MaxHeap.java     # Generic array-based binary max-heap
│           │   └── RankingHeap.java # Domain wrapper: ranks MatchEntry by score
│           └── similarity/
│               └── CosineSimilarity.java  # TF-IDF vector similarity scorer
│
└── jobjob-frontend/                 # React 19 + TypeScript + Vite SPA
    └── src/
        ├── components/              # SwipeCard, MatchDashboard, etc.
        └── ...
```

---

## ⚙️ Core Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Core language |
| Spring Boot | 3.2.5 | REST API framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | ORM layer (next phase) |
| Lombok | 1.18.30 | Boilerplate reduction |
| MySQL Connector/J | 8.x | Database driver |
| Maven | 3.x | Build & dependency management |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI library |
| TypeScript | 5.9 | Type-safe JavaScript |
| Vite | 7.x | Build tool & dev server |
| Framer Motion | 12.x | Swipe animations & transitions |
| React Router | 7.x | Client-side routing |
| Zustand | 5.x | Global state management |
| Tailwind CSS | 4.x | Utility-first styling |
| Axios | 1.x | HTTP client for API calls |

---

## 🧠 DSA Engine — For the Professor

> **Important:** All data structures below are **custom, hand-written implementations** in the `com.jobjob.dsa` package. No `java.util.PriorityQueue`, no third-party libraries were used for these components.

### 1. 🌳 Trie — Prefix Search (`dsa/trie/`)

**Purpose:** Real-time job title autocomplete suggestions.

**Files:** `TrieNode.java`, `JobTrie.java`

**Implementation detail:** Each `TrieNode` stores its children in a `HashMap<Character, TrieNode>`. The `JobTrie` performs a DFS traversal from the matched prefix node to collect all complete words, fully case-insensitive via `toLowerCase()` normalisation.

| Operation | Complexity |
|-----------|------------|
| `insert(word)` | **O(m)** — m = word length |
| `suggest(prefix, limit)` | **O(m + k)** — k = result count |
| Space | **O(Σ × N × m)** |

**Connected to:** `MatchingService.suggest()` → future `GET /api/jobs/suggest?prefix=<query>`

---

### 2. 🔺 Max-Heap — Candidate Ranking (`dsa/heap/`)

**Purpose:** Sort all job matches for a candidate by score, yielding the top-N results.

**Files:** `MaxHeap.java`, `RankingHeap.java`

**Implementation detail:**
- `MaxHeap<T extends Comparable<T>>` is a fully generic, **array-based binary max-heap** using an `ArrayList` as internal storage. It implements `siftUp` on `offer()` and `siftDown` on `poll()` manually.
- `RankingHeap` wraps `MaxHeap` with a typed domain `record MatchEntry(id, title, company, score)` and exposes `push()` / `drainRanked()`.

| Operation | Complexity |
|-----------|------------|
| `offer(item)` | **O(log n)** |
| `poll()` | **O(log n)** |
| `peek()` | **O(1)** |
| `drainRanked()` | **O(n log n)** |

**Connected to:** `MatchingService.rankJobsForCandidate()`

---

### 3. 📐 Cosine Similarity — Match Scoring (`dsa/similarity/`)

**Purpose:** Compute a numeric match score (0–100%) between a candidate's CV and a job description.

**File:** `CosineSimilarity.java`

**Implementation detail:** Both CVs and JDs are represented as **sparse TF-IDF term-frequency vectors** (`Map<String, Double>`). The dot product iterates over the smaller map for efficiency. The score is then normalized by the Euclidean norms of both vectors.

```
similarity(A, B) = dot(A, B) / (||A|| × ||B||)   ∈ [0.0, 1.0]
```

Additional utilities exposed:
- `intersectTerms()` — returns matched skills (shared keys)
- `missingTerms()` — returns skills in JD that are absent from CV

| Operation | Complexity |
|-----------|------------|
| `compute(vecA, vecB)` | **O(n + m)** — n, m = unique terms |
| Space | **O(n + m)** |

**Connected to:** `MatchingService.compareVectors()`, `rankJobsForCandidate()`

---

### DSA Data Flow

```
User Swipe Action
      │
      ▼
MatchingService (Orchestrator)
      │
      ├──[Prefix Query]──▶ JobTrie.suggest()         ──▶ List<String>
      │
      ├──[Score Query]───▶ CosineSimilarity.compute() ──▶ double [0,1]
      │
      └──[Rank Query]────▶ RankingHeap.drainRanked()  ──▶ List<MatchEntry>
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.x (or use the included `mvnw` wrapper)
- Node.js 18+ & npm
- MySQL 8.x

### Backend

```bash
cd jobjob-backend

# Run with Maven Wrapper (no local Maven required)
.\mvnw spring-boot:run
```

The API will be live at **`http://localhost:8080`**.

> **Note:** Spring Security is active. A generated password will be printed to the console on first run until authentication is fully configured.

### Frontend

```bash
cd jobjob-frontend
npm install
npm run dev
```

The UI will be live at **`http://localhost:5173`**.

---

## 🗺️ Roadmap

### P1 — Database Layer *(Next Phase)*

- [ ] Design MySQL schema: `users`, `jobs`, `resumes`, `matches` tables
- [ ] Create JPA `@Entity` classes mapped to the schema
- [ ] Configure `application.yml` with live MySQL datasource
- [ ] Seed initial data for development & demo

### P2 — REST API Bridge

- [ ] Implement `MatchController` to expose DSA engine results as REST endpoints
  - `GET /api/jobs/suggest?prefix=<query>` → Trie autocomplete
  - `POST /api/match/score` → Cosine similarity score
  - `GET /api/match/rank/{candidateId}` → Ranked job list from Max-Heap
- [ ] Replace stub `buildVector()` with a proper TF-IDF tokeniser
- [ ] Integrate Spring Security with JWT-based auth

### P3 — Frontend Integration

- [ ] Connect `SwipeCard` component to live `GET /api/match/rank` endpoint
- [ ] Display real-time match score badges from backend
- [ ] Wire up the Trie autocomplete into the job search input
- [ ] Implement swipe-to-accept / swipe-to-reject calls to the API

---

## 📄 License

This project is developed for academic purposes as part of a Data Structures & Algorithms course.

---

<div align="center">
  <sub>Built with ☕ Java, 🌱 Spring Boot, and ⚛️ React — powered by custom DSA</sub>
</div>
