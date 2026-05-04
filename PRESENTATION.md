# RecipeVault — Final Presentation
## CSE323 · Advanced Database Systems

> **Application:** RecipeVault — A Full-Stack NoSQL Recipe Management System  
> **Tech Stack:** HTML · CSS · Vanilla JavaScript · Node.js · Express · MongoDB · Docker  
> **Presentation Format:** 20 slides · 15–20 minutes + Q&A

---

---

## 🖥️ SLIDE 01 — Title

---

# RecipeVault
### A NoSQL-Powered Recipe Book Web Application

| | |
|---|---|
| **Course** | CSE323 — Advanced Database Systems |
| **Team** | *(Add team member names & student IDs)* |
| **Date** | *(Add presentation date)* |
| **Repository** | github.com/ArwaMohey/ADB-Project |

> *"From handwritten recipe cards to a fully searchable, containerised, cloud-ready database application."*

---

---

## 🖥️ SLIDE 02 — Agenda

---

### What We Will Cover Today

| # | Topic |
|---|---|
| **01** | Project Idea & Motivation |
| **02** | Target Audience & Use Cases |
| **03** | Why NoSQL? The Problem with Relational Databases |
| **04** | SQL vs. NoSQL — A Structured Comparison |
| **05** | MongoDB Explained — How It Works |
| **06** | Technology Stack |
| **07** | System Architecture |
| **08** | MongoDB Data Model & Indexing Strategy |
| **09** | CRUD Operations & Security |
| **10** | Docker Deployment |
| **11** | Live Demo |
| **12** | Implementation Challenges |
| **13** | Lessons Learned |
| **14** | Future Roadmap |
| **15** | Q&A |

---

---

## 🖥️ SLIDE 03 — Project Idea & Motivation

---

### What is RecipeVault?

**RecipeVault** is a full-stack web application that enables users to manage a personal collection of culinary recipes through a clean, browser-based interface.

#### Core Features

| Feature | Description |
|---|---|
| ✅ **CRUD Operations** | Create, read, update, and delete recipes |
| 🔍 **Full-Text Search** | Real-time search across name, description, and ingredients |
| 🗂️ **Category Filtering** | Filter by Breakfast, Lunch, Dinner, Dessert, Snack, Drink |
| 🔃 **Multi-Sort Modes** | By date (newest/oldest), alphabetically, or by total cook time |
| 📊 **Stats Dashboard** | Live counts per category |
| 🐳 **Docker Deployment** | One-command setup on any machine |

#### The Problem We Are Solving

> Traditional recipe storage — handwritten books, spreadsheet files, basic note apps — is **unstructured, unsearchable, and hard to scale**. RecipeVault brings recipes into a modern, queryable, web-accessible data store.

---

---

## 🖥️ SLIDE 04 — Target Audience

---

### Who Uses RecipeVault?

| Segment | Profile | Primary Need |
|---|---|---|
| 🏠 **Home Cooks** | Individuals with large handwritten recipe collections | Digitise, search, and retrieve recipes instantly |
| 📝 **Food Bloggers & Enthusiasts** | Content creators with hundreds of recipes across cuisines | Organise, tag, and publish content efficiently |
| 🎓 **Culinary Students** | Students tracking techniques, timings, and difficulty | Annotate and filter by difficulty or preparation time |
| 🍽️ **Small Food Businesses** | Cafés and catering businesses managing working menus | Lightweight, offline-capable, Docker-deployable catalogue |

#### Estimated Scale

| Metric | Estimated Range |
|---|---|
| Recipes per user | 50 – 2,000 |
| Concurrent users (MVP) | 1 – 50 |
| Target deployment | Single Docker host or cloud VM |

---

---

## 🖥️ SLIDE 05 — The Problem with SQL for Recipes

---

### Why a Relational Database Would Work Against Us

#### Recipes Are Heterogeneous by Nature

```
Smoothie Recipe:    name, ingredients, prepTime
                    (no cookTime, no oven temperature)

Baked Soufflé:      name, ingredients, prepTime, cookTime, ovenTemp, difficulty
                    (every field present)

Cocktail Recipe:    name, ingredients (in fluid ounces), prepTime
                    (no cookTime, non-standard units)
```

#### What SQL Forces You To Do

```
Problem 1 — Sparse columns
  ALTER TABLE recipes ADD COLUMN ovenTemp INT NULL;
  → Every row that has no oven temperature stores NULL.
  → Schema migration required for every new attribute.

Problem 2 — Normalised lists require extra tables
  CREATE TABLE recipe_ingredients (
    id          INT PRIMARY KEY,
    recipe_id   INT REFERENCES recipes(id),
    name        VARCHAR(100),
    quantity    VARCHAR(50),
    unit        VARCHAR(20)
  );
  → Every ingredient read or write requires a JOIN.
  → Inserting a recipe = multiple INSERT statements across tables.

Problem 3 — Full-text search
  → Requires PostgreSQL extension (pg_trgm) or an external engine (Elasticsearch).
  → Not built in; must be added and managed separately.
```

#### The Core Tension

> A recipe is a **single, coherent unit of information**. A relational database forces you to shred it into fragments spread across multiple tables — then reassemble it on every read with JOIN operations.

---

---

## 🖥️ SLIDE 06 — SQL vs. NoSQL — The Full Comparison

---

### Relational (SQL) vs. Document (NoSQL) Databases

| Dimension | SQL (PostgreSQL / MySQL) | NoSQL — MongoDB (Document) |
|---|---|---|
| **Data Model** | Tables with fixed rows and columns | Collections of JSON-like documents |
| **Schema** | Rigid — must define all columns upfront | Flexible — each document can have different fields |
| **Relationships** | Foreign keys + JOIN queries | Embedding or referencing by ObjectId |
| **Query Language** | SQL (SELECT, JOIN, WHERE) | MQL — MongoDB Query Language (JSON-based) |
| **Scaling Model** | Vertical (bigger machine) | Horizontal (sharding across commodity nodes) |
| **Transactions** | Full ACID across multiple tables | ACID within single document; multi-doc transactions supported |
| **Full-Text Search** | Extension required (pg_trgm, FULLTEXT) | Native text index with weighted relevance |
| **Schema Changes** | `ALTER TABLE` — often requires downtime | Add new field to any document instantly |
| **JSON/API Integration** | Rows must be serialised to JSON | Documents map directly to JSON — zero conversion |
| **Best For** | Financial systems, complex relationships, reporting | Catalogs, content, real-time apps, flexible data |

#### Applied to RecipeVault

| Requirement | SQL Approach | MongoDB Approach |
|---|---|---|
| Store ingredient list | Separate `recipe_ingredients` table + JOIN | Array field inside recipe document |
| Search by ingredient | Full-table scan or `pg_trgm` extension | Native weighted text index — O(log n) |
| Add "allergens" field | `ALTER TABLE` — migration script | Just add the field to new documents |
| Fetch a full recipe | JOIN across 3–4 tables | Single `findOne()` call |

---

---

## 🖥️ SLIDE 07 — MongoDB Explained

---

### How MongoDB Works

#### Core Concepts

| Concept | MongoDB | SQL Equivalent |
|---|---|---|
| **Database** | `recipevault` | Database |
| **Collection** | `recipes` | Table |
| **Document** | `{ _id, name, ingredients, … }` | Row / Record |
| **Field** | `name: "Shakshuka"` | Column / Cell |
| **Index** | Text index, compound index | Index |
| **ObjectId** | `_id: ObjectId("6651a4c2…")` | Primary Key (auto) |

#### Sample MongoDB Document

```json
{
  "_id": "ObjectId('6651a4c2f3b2c8001e4d9e01')",
  "name": "Shakshuka",
  "category": "Breakfast",
  "description": "Poached eggs in spiced tomato sauce.",
  "prepTime": 10,
  "cookTime": 25,
  "servings": 4,
  "difficulty": "Easy",
  "ingredients": "2 tbsp olive oil\n1 onion\n4 eggs\nCrushed tomatoes",
  "instructions": "Heat oil\nSauté onion\nAdd tomatoes\nCook eggs",
  "createdAt": "2024-05-25T10:30:00.000Z"
}
```

#### Key MongoDB Features Used in RecipeVault

| Feature | How We Use It |
|---|---|
| **Compound Text Index** | Weighted full-text search across `name`(×10), `ingredients`(×5), `description`(×1) |
| **Category Index** | O(log n) filter queries on the `category` field |
| **Timestamp Index** | Instant sort by `createdAt` newest/oldest |
| **Mongoose ODM** | Schema validation, enum enforcement, type casting in JavaScript |
| **Atomic Documents** | One `findOne()` fetches an entire recipe — no JOINs |

#### MongoDB Query vs. SQL — Side by Side

```
-- SQL: Get all Breakfast recipes sorted by creation date
SELECT r.*, ri.name as ingredient_name
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
WHERE r.category = 'Breakfast'
ORDER BY r.created_at DESC;

// MongoDB: Same query — one line, one round-trip
db.recipes.find({ category: "Breakfast" }).sort({ createdAt: -1 })
```

---

---

## 🖥️ SLIDE 08 — Technology Stack

---

### The Full Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│          HTML5 · CSS3 · Vanilla JavaScript                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP (port 80)
┌──────────────────────▼──────────────────────────────────────┐
│                    WEB SERVER                               │
│              Nginx  (reverse proxy + static)                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP reverse proxy /api → :5000
┌──────────────────────▼──────────────────────────────────────┐
│                     BACKEND                                 │
│           Node.js 18+  ·  Express 4.x                       │
│        CORS · Rate Limit · Input Sanitisation               │
│              Mongoose 7.x (ODM layer)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ MongoDB Wire Protocol (port 27017)
┌──────────────────────▼──────────────────────────────────────┐
│                     DATABASE                                │
│                    MongoDB 6                                │
│      Text Index · Category Index · Timestamp Index          │
└─────────────────────────────────────────────────────────────┘
         All three services containerised with Docker Compose
```

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend** | Vanilla JS, HTML5, CSS3 | Zero framework overhead; demonstrates core DOM mastery |
| **Web Server** | Nginx | High-performance static serving + reverse proxy in one container |
| **Runtime** | Node.js 18 LTS | Non-blocking I/O; same language as frontend |
| **Framework** | Express 4.x | Minimal, unopinionated; ideal for REST APIs |
| **ODM** | Mongoose 7.x | Schema validation, type safety, and lifecycle hooks for MongoDB |
| **Database** | MongoDB 6 | Document model, native text search, horizontal scalability |
| **Container** | Docker + Compose | Reproducible one-command deployment on any host |

---

---

## 🖥️ SLIDE 09 — System Architecture

---

### Layered Architecture Overview

```
Frontend (Nginx · HTML · CSS · JS)
  │  ↕ HTTP JSON API
  ▼
┌─────────────────────────────────┐
│        Security Layer           │
│  CORS whitelisting              │
│  Rate Limit (100 req/15 min)    │
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│        Express Router           │
│  GET/POST  /api/recipes         │
│  GET/PUT/DELETE  /api/recipes/:id│
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│       Recipe Controller         │
│  ┌───────────────────────────┐  │
│  │  sanitiseRecipeBody()     │  │
│  │  escapeRegex()            │  │
│  │  Query builder            │  │
│  └──────────┬────────────────┘  │
└─────────────┼───────────────────┘
              │
┌─────────────▼───────────────────┐
│         Mongoose ODM            │
│  Schema validation · Enum guard │
│  Type casting · Timestamps      │
└─────────────┬───────────────────┘
              │ Wire Protocol
┌─────────────▼───────────────────┐
│     MongoDB — recipes DB        │
│  [Text Index]  [Category Index] │
│  [Timestamp Index]              │
└─────────────────────────────────┘
```

**MVC Architecture Map**

| MVC Layer | File | Responsibility |
|---|---|---|
| **Model** | `backend/models/Recipe.js` | Schema, validation, index registration |
| **Controller** | `backend/controllers/recipeController.js` | Business logic, sanitisation, Mongoose calls |
| **Router** | `backend/routes/recipes.js` | HTTP verb → controller mapping |
| **Entry Point** | `backend/server.js` | App bootstrap, middleware registration |
| **View** | `frontend/` (separate container) | Stateless JSON consumer; renders UI from API responses |

---

---

## 🖥️ SLIDE 10 — Data Model & Indexing Strategy

---

### The Recipe Document Schema

```javascript
// backend/models/Recipe.js
const RecipeSchema = new mongoose.Schema({
  name:         { type: String, required: true,  trim: true, maxlength: 120 },
  category:     { type: String, required: true,  enum: ['Breakfast','Lunch','Dinner','Dessert','Snack','Drink'] },
  description:  { type: String, default: '',     maxlength: 500 },
  prepTime:     { type: Number, min: 0,          default: 0 },
  cookTime:     { type: Number, min: 0,          default: 0 },
  servings:     { type: Number, min: 1,          default: 1 },
  difficulty:   { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  ingredients:  { type: String, default: '',     trim: true },
  instructions: { type: String, default: '',     trim: true },
}, { timestamps: true });

// Compound text index — weighted relevance search
RecipeSchema.index(
  { name: 'text', description: 'text', ingredients: 'text' },
  { weights: { name: 10, ingredients: 5, description: 1 } }
);
```

### Three Indexes — Three Query Patterns

| Index | Fields | Supports | Query Complexity |
|---|---|---|---|
| **Text Index** | `name`(×10) · `ingredients`(×5) · `description`(×1) | `$text` and `$regex` search | O(log n) via inverted index |
| **Category Index** | `{ category: 1 }` | `?category=Breakfast` filter | O(log n) via B-tree |
| **Timestamp Index** | `{ createdAt: -1 }` | Newest/oldest sort | O(log n) index scan |

### NoSQL Design Decision: Embedding vs. Referencing

```
Why ingredients are stored as a plain String (not an array of sub-documents):

✅ Direct textarea ↔ DB round-trip — no serialisation needed
✅ Full-text search works across the whole string naturally
✅ Single-document atomic write — no multi-document transactions
✅ Appropriate for current query patterns (no per-ingredient filtering needed)

If per-ingredient filtering were needed in future → migrate to embedded array
```

---

---

## 🖥️ SLIDE 11 — CRUD Operations & Security

---

### CRUD Endpoints — End-to-End

| Operation | HTTP | Route | Mongoose | MongoDB Equivalent |
|---|---|---|---|---|
| List all | `GET` | `/api/recipes` | `Recipe.find(query).sort(…)` | `db.recipes.find(query).sort(…)` |
| Get one | `GET` | `/api/recipes/:id` | `Recipe.findById(id)` | `db.recipes.findOne({ _id })` |
| Create | `POST` | `/api/recipes` | `Recipe.create(data)` | `db.recipes.insertOne(data)` |
| Update | `PUT` | `/api/recipes/:id` | `Recipe.findByIdAndUpdate(id, updates, { new:true })` | `db.recipes.updateOne({ _id }, { $set })` |
| Delete | `DELETE` | `/api/recipes/:id` | `Recipe.findByIdAndDelete(id)` | `db.recipes.deleteOne({ _id })` |

### Security Layer — Defence in Depth

```
Inbound request
      │
      ▼
  ┌──────────────────────────────────────┐
  │  1. CORS Whitelisting                │
  │     Only allowedOrigins receive      │
  │     a valid CORS header.             │
  └──────────────────┬───────────────────┘
                     │
  ┌──────────────────▼───────────────────┐
  │  2. Rate Limiting                    │
  │     100 req / 15 min per IP          │
  │     → HTTP 429 on breach             │
  └──────────────────┬───────────────────┘
                     │
  ┌──────────────────▼───────────────────┐
  │  3. Input Sanitisation               │
  │     sanitiseRecipeBody() — whitelist │
  │     escapeRegex() — no regex inject  │
  └──────────────────┬───────────────────┘
                     │
  ┌──────────────────▼───────────────────┐
  │  4. Mongoose Enum Validation         │
  │     Validates category/difficulty    │
  │     before any DB write              │
  └──────────────────┬───────────────────┘
                     │
  ┌──────────────────▼───────────────────┐
  │  5. Central Error Handler            │
  │     Converts Mongoose errors to safe │
  │     HTTP responses — no stack traces │
  └──────────────────────────────────────┘
```

| Security Concern | Implementation |
|---|---|
| Cross-Origin Requests | CORS `allowedOrigins` whitelist |
| Brute-force / DoS | `express-rate-limit` — 429 on excess |
| Regex Injection | `escapeRegex()` — escapes metacharacters |
| Schema Bypass | `sanitiseRecipeBody()` — strict whitelist |
| XSS in Frontend | `esc()` — HTML-encodes all user content |
| Information Leakage | `errorHandler` — never exposes stack traces |

---

---

## 🖥️ SLIDE 12 — Docker Deployment

---

### Three Containers, One Command

```bash
# Start the entire application
docker compose -f docker/docker-compose.yml up --build -d

# Verify all three containers are healthy
docker compose -f docker/docker-compose.yml ps
```

```
┌──────────────────────────────────────────────────────────────┐
│                     Docker Host                              │
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐               │
│  │ frontend         │    │ backend          │               │
│  │ Nginx            │───▶│ Node.js/Express  │               │
│  │ Port: 80         │    │ Port: 5001→5000  │               │
│  └──────────────────┘    └────────┬─────────┘               │
│                                   │ Wire Protocol            │
│                          ┌────────▼─────────┐               │
│                          │ mongo            │               │
│                          │ MongoDB 6        │               │
│                          │ Port: 27017      │               │
│                          │ [healthcheck]    │               │
│                          └────────┬─────────┘               │
│                                   │                          │
│                          ┌────────▼─────────┐               │
│                          │ mongo_data volume│               │
│                          │ /data/db         │               │
│                          └──────────────────┘               │
│                                                              │
│              All on: recipevault-network                     │
└──────────────────────────────────────────────────────────────┘
```

| Service | Image | Port Mapping | Role |
|---|---|---|---|
| `frontend` | Nginx (custom Dockerfile) | `80:80` | Static files + `/api` reverse proxy |
| `backend` | Node.js 18 (custom Dockerfile) | `5001:5000` | REST API |
| `mongo` | `mongo:6` (official) | `27017:27017` | Database with `mongosh ping` health-check |

**Key Compose Features**
- `depends_on: mongo: condition: service_healthy` — backend waits for DB to be ready
- `mongo_data` named volume — recipes persist across container restarts
- Internal DNS — backend reaches MongoDB via `mongodb://mongo:27017/recipevault`

---

---

## 🖥️ SLIDE 13 — Live Demo

---

### Demo Script

| Step | Action | Expected Outcome |
|---|---|---|
| **1** | Open `http://localhost` | Recipe grid loads with seeded data |
| **2** | Browse recipe cards | Stats bar shows category totals |
| **3** | Click "＋ Add Recipe" → fill form → Save | Toast: "Recipe added ✓"; new card at top of grid |
| **4** | Click a recipe card | Detail modal with all fields |
| **5** | Type "egg" in search box | Grid filters in real-time |
| **6** | Select "Breakfast" from category dropdown | Only Breakfast recipes shown |
| **7** | Select "By cook time" sort | Cards reordered by ascending total cook time |
| **8** | Click "Edit" → change name → Save | Toast: "Recipe updated ✓"; card reflects change |
| **9** | Click "Delete" → Confirm | Toast: "Recipe deleted ✓"; card removed |
| **10** | `docker exec -it recipevault-mongo mongosh` | `db.recipes.find().pretty()` shows live data |

**MongoDB Shell Commands for Demo**
```javascript
use recipevault
db.recipes.find().pretty()       // View all recipes
db.recipes.countDocuments()      // Total count
db.recipes.getIndexes()          // Show registered indexes
db.recipes.find({ category: "Breakfast" }).explain("executionStats")
                                 // Prove index is being used
```

---

---

## 🖥️ SLIDE 14 — Implementation Challenges

---

### Challenges We Encountered & How We Solved Them

| # | Challenge | Root Cause | Solution |
|---|---|---|---|
| **C1** | **CORS errors in Docker** | Frontend (port 80) and backend (port 5001) treated as cross-origin by browser | Nginx reverse-proxy maps `/api` to backend internally — frontend makes same-origin requests; CORS policy only applied at Docker host boundary |
| **C2** | **MongoDB container startup race** | Backend started and attempted DB connection before MongoDB was ready → `ECONNREFUSED` crash loop | `depends_on: mongo: condition: service_healthy` with `mongosh --eval "db.adminCommand('ping')"` health-check; backend waits until DB is accepting connections |
| **C3** | **Regex injection in search** | Raw user search strings passed directly to MongoDB `$regex` → potential ReDoS attack | `escapeRegex()` escapes all regex metacharacters (`\ ^ $ . | ? * + ( ) [ ] { }`) and caps input at 200 characters |
| **C4** | **Enum bypass via API** | Users posting invalid `category` values could reach the database | `sanitiseRecipeBody()` whitelists against `VALID_CATEGORIES` and `VALID_DIFFICULTIES` arrays before any Mongoose call |
| **C5** | **Sort mode requiring extra API calls** | Initial design re-fetched data from MongoDB on every sort change → latency and rate limit pressure | Caches full collection in client-side `recipes[]` array on first load; all sort and filter operations are pure JavaScript — zero network round-trips |
| **C6** | **Mongoose errors exposing schema** | Unhandled `ValidationError` and `CastError` objects returned as raw JSON to client | Central `errorHandler` middleware intercepts all errors, maps them to safe HTTP 400/404/500 responses with user-friendly messages; stack traces never reach the client |

---

---

## 🖥️ SLIDE 15 — Sorting Algorithm Analysis

---

### Four Sort Modes — One Algorithm

```javascript
// frontend/app.js — renderGrid()
if      (currentSort === 'newest') docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
else if (currentSort === 'oldest') docs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
else if (currentSort === 'az')     docs.sort((a, b) => a.name.localeCompare(b.name));
else if (currentSort === 'time')   docs.sort((a, b) => (a.cookTime + a.prepTime) - (b.cookTime + b.prepTime));
```

### Why TimSort?

JavaScript's `Array.prototype.sort()` is implemented with **TimSort** in all modern engines (V8, SpiderMonkey, JavaScriptCore):

```
TimSort = Merge Sort + Insertion Sort
  ├── Divide array into natural "runs" (already-sorted subsequences)
  ├── Sort each run with Insertion Sort (optimal for small arrays)
  └── Merge runs with Merge Sort (O(n log n) guarantee)
```

### Time & Space Complexity

| Scenario | Time Complexity | Notes |
|---|---|---|
| **Best case** | **O(n)** | Array already sorted — TimSort detects natural runs, no merges needed |
| **Average case** | **O(n log n)** | Standard random ordering |
| **Worst case** | **O(n log n)** | Guaranteed upper bound — no O(n²) degradation |
| **Space** | **O(n)** | Auxiliary merge buffer |

### Per-Comparator Cost

| Sort Mode | Comparator | Cost |
|---|---|---|
| Newest / Oldest | `new Date(str) - new Date(str)` | O(1) after date parse |
| A → Z | `String.localeCompare()` | O(k) where k ≤ 120 chars ≈ O(1) |
| By cook time | `(cookTime + prepTime) - (cookTime + prepTime)` | O(1) integer arithmetic |

> **Overall sort cost: O(n log n)** — excellent for any realistic personal recipe collection.

---

---

## 🖥️ SLIDE 16 — Lessons Learned

---

### 6 Key Takeaways

#### 1. NoSQL Schema Design Is a Deliberate Architecture Decision

> Embedding `ingredients` and `instructions` as plain strings is a **trade-off**: strings match the textarea UI perfectly and enable full-text indexing, but prevent per-ingredient queries. The right schema depends entirely on the **query patterns your application needs** — there is no universally correct approach.

#### 2. MongoDB Indexes Are the Biggest Lever for Query Performance

> Without indexes, every search would be a full collection scan — **O(n)**. With our compound text index (name×10, ingredients×5, description×1), search is **O(log n)** via an inverted index. The correct index strategy is the single most impactful performance decision in a MongoDB application.

#### 3. Docker Compose Health Checks Are Essential

> Without `condition: service_healthy`, the backend container started and immediately crashed because MongoDB was not yet accepting connections. A `mongosh ping` health-check made the startup sequence deterministic — a lesson in **infrastructure dependency ordering**.

#### 4. Centralised Error Handling Prevents Information Leakage

> Raw Mongoose `ValidationError` objects contain the full schema definition in their `errors` property — exactly the information an attacker needs to craft bypass attempts. Centralised error handling is a **security control**, not just a UX improvement.

#### 5. Vanilla JavaScript Is Sufficient for Moderate-Complexity SPAs

> We built a full modal system, dynamic grid, toast notifications, client-side filtering, and state management in pure JavaScript — without React, Vue, or any UI framework. **Frameworks solve real problems, but add complexity; choose them deliberately.**

#### 6. Security Must Be Designed In, Not Bolted On

> Rate limiting, CORS whitelisting, regex escaping, enum validation, and XSS prevention were built alongside features from day one. Retrofitting security into an existing codebase is **significantly harder** — and gaps are easy to miss.

---

---

## 🖥️ SLIDE 17 — Use Case & Architecture Diagrams

---

### Use Case Diagram

> *(Render from Section 2.1 of DOCUMENTATION.md — paste PlantUML block into plantuml.com)*

**Key Relationships to Highlight:**
- All read operations (View, Search, Filter, Sort) are available without prerequisites
- Mutating operations (Create, Edit, Delete) extend from read operations, mirroring the UI navigation flow

### Architecture Overview Diagram

> *(Render from Section 2.4 of DOCUMENTATION.md)*

**Walk-through path (left → right, top → bottom):**
1. Browser → Frontend pages
2. Frontend → Security Layer (CORS + Rate Limit)
3. Security Layer → Router → Controller
4. Controller → Input Sanitiser → Mongoose ODM
5. Mongoose → MongoDB Collection → Indexes

---

---

## 🖥️ SLIDE 18 — Future Roadmap

---

### Planned Enhancements

| Priority | Feature | Technical Approach |
|---|---|---|
| 🔴 **High** | User authentication | JWT tokens · bcrypt password hashing · per-user recipe ownership |
| 🔴 **High** | Recipe image upload | MongoDB GridFS or AWS S3 · multipart form handling |
| 🟡 **Medium** | Rating & comments system | Embedded sub-document array per recipe · `$push` operator |
| 🟡 **Medium** | Analytics dashboard | MongoDB Aggregation Pipeline · `$group`, `$avg`, `$count` by category |
| 🟡 **Medium** | Public recipe sharing | URL-sharable links · read-only recipe view endpoint |
| 🟢 **Low** | Progressive Web App (PWA) | Service Worker · IndexedDB offline cache |
| 🟢 **Low** | Automated test suite | Jest unit tests for controllers · Playwright E2E tests |
| 🟢 **Low** | CI/CD pipeline | GitHub Actions · automated Docker build + deploy |

### Database Evolution Path

```
Current (MVP)            →  V2 (Multi-user)            →  V3 (Scale)
──────────────────────────────────────────────────────────────────────
Single collection         Multi-collection              Sharded cluster
(recipes only)            (users + recipes)             (distributed)
Single user               JWT auth + per-user           Replica set
Client-side sort          Server-side pagination        Aggregation pipelines
```

---

---

## 🖥️ SLIDE 19 — Conclusion

---

### What We Built & What We Proved

#### ✅ Delivered

| Deliverable | Status |
|---|---|
| Full-stack CRUD web application | ✅ Complete |
| NoSQL document data model with compound indexes | ✅ Complete |
| MVC architecture (Express + Mongoose) | ✅ Complete |
| Production-grade security layer (CORS, rate limit, sanitisation) | ✅ Complete |
| Fully containerised Docker Compose deployment | ✅ Complete |
| Real-time full-text search with weighted relevance | ✅ Complete |
| Client-side sorting with TimSort analysis | ✅ Complete |

#### 🎓 Core Thesis Demonstrated

> **MongoDB's document model is architecturally superior to a relational database for this use case** — not because NoSQL is always better, but because a recipe is a natural document: heterogeneous attributes, nested lists, and full-text content that maps directly to a single JSON object. The forced fragmentation of a relational schema would add complexity without adding value.

#### 📌 Repository

```
https://github.com/ArwaMohey/ADB-Project
```

---

---

## 🖥️ SLIDE 20 — Q&A

---

### Thank You

> *"RecipeVault — from data model to Docker, we've covered the complete lifecycle of a NoSQL-powered web application."*

---

### Anticipated Questions

| Question | Prepared Answer |
|---|---|
| **Why not PostgreSQL with JSONB?** | JSONB can store documents, but lacks native weighted text search, requires extension management, and doesn't map as cleanly to JavaScript's object model as MongoDB. For a document-centric app, MongoDB is the natural choice. |
| **How would the design change for public recipe sharing?** | Add a `userId` reference field + authentication middleware. Recipes become scoped to their owner. A `isPublic: Boolean` flag enables opt-in sharing without structural changes to the schema. |
| **What is the impact of the text index on write performance?** | Text index maintenance adds ~10–15% write overhead per document. For a recipe catalogue where reads vastly outnumber writes, this is an entirely acceptable trade-off. |
| **How would you shard MongoDB at scale?** | Shard on `_id` (default hash-based) for even distribution, or on `category` if category-level data locality is desired. The existing index structure already supports sharded query routing. |
| **Why not use Elasticsearch for search?** | Elasticsearch is a dedicated search engine and would be appropriate for millions of documents. At our scale (hundreds to thousands of recipes), MongoDB's native text index provides equivalent capability with zero additional infrastructure. |

---

---

*End of Presentation — RecipeVault · CSE323 Advanced Database Systems*

---

> **Rendering Instructions:**
> - PlantUML diagrams: paste blocks from `DOCUMENTATION.md` into [plantuml.com](https://www.plantuml.com/plantuml) or use VS Code PlantUML extension
> - Convert to PPTX: copy slide content into PowerPoint/Google Slides, one `---` section per slide
> - Recommended theme: **dark professional** (e.g., PowerPoint "Ion Boardroom" or Google Slides "Slate")
