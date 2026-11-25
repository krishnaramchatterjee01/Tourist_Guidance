# Explore India — Full-Stack Tourism Guidance Platform

A production-grade, Apple-inspired full-stack web application for discovering India's 28 States, 8 Union Territories, 739 Districts, and iconic tourist attractions.

---

## 1. Project Overview & Technology Stack

The Explore India platform has been transformed from a static client application into a full-stack web application backed by a relational MySQL database.

```
React Frontend (Vite)
       │
       │ HTTP Requests (Fetch API / AbortController)
       ▼
Node.js + Express REST API (Port 5000)
       │
       │ Parameterized Queries (mysql2/promise)
       ▼
MySQL Database (Port 3306)
```

### Technology Stack:
- **Frontend:** React 18, Vite 6, React Router DOM 6, GSAP 3, CSS3, HTML5
- **Backend:** Node.js (v24+ / v18+), Express.js 4, Helmet, CORS, Express-Rate-Limit, Dotenv
- **Database:** MySQL 8.0+ (InnoDB, UTF8MB4)
- **Database Management Tool:** MySQL Workbench 8.0
- **Testing:** Node.js native test runner (`node --test`), Supertest

---

## 2. Final Project Directory Structure

```
Tourist_guide 2.0/
│
├── frontend/                     # React.js SPA Application
│   ├── public/
│   │   └── images/               # Verified local photographic assets
│   │       ├── attractions/      # 16 Top Places images
│   │       ├── destinations/     # 16 Explore destinations images
│   │       ├── districts/        # Curated district images (AP, AR, WB, UP)
│   │       ├── states/           # 28 State landmark images
│   │       ├── union-territories/# 8 Union Territory images
│   │       └── fallback/         # SVG fallback placeholder
│   ├── src/
│   │   ├── assets/               # Local icons & static placeholders
│   │   ├── components/           # Reusable UI components (Navbar, Slider, SmartImage, Modal)
│   │   ├── context/              # ThemeContext (Light & Dark mode state)
│   │   ├── hooks/                # useBackgroundImage hook
│   │   ├── pages/                # Route views (Home, Explore, States, StateDirectory, DistrictDetail, TopPlaces, ComingSoon)
│   │   ├── services/             # Centralized API client (api.js)
│   │   ├── styles/               # Glassmorphism stylesheets (style.css, districts.css)
│   │   ├── App.jsx               # React Router route registry
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html                # Vite SPA entry HTML
│   ├── vite.config.js            # Vite config with /api reverse proxy
│   ├── package.json              # Frontend dependencies
│   ├── package-lock.json
│   └── .env.example              # Frontend environment template
│
├── backend/                      # Node.js + Express REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # MySQL connection pooling with mysql2/promise
│   │   │   └── env.js            # Environment validation & loading
│   │   ├── controllers/          # State, District, Place, Collection, Search controllers
│   │   ├── middleware/           # Centralized errorHandler, rateLimiter, requestLogger
│   │   ├── models/               # Parameterized SQL database models (State, District, Place, Collection, Search)
│   │   ├── routes/               # API route definitions (/api/*)
│   │   ├── utils/                # Serializer (DB snake_case -> React camelCase)
│   │   ├── app.js                # Express app setup (separable for testing)
│   │   └── server.js             # Server listener & graceful shutdown
│   ├── database/
│   │   ├── schema.sql            # Master MySQL relational schema
│   │   ├── migrations/           # Versioned idempotent schema migrations (001_initial_schema.sql, migrate.js)
│   │   ├── seeds/                # Idempotent data seeding script (seed.js)
│   │   └── source-data/          # Migration source datasets (master baseline)
│   ├── scripts/
│   │   └── verify-data.js        # Automated verification comparing MySQL vs source baseline
│   ├── tests/
│   │   └── api.test.js           # REST API unit and integration tests
│   ├── package.json              # Backend dependencies
│   ├── package-lock.json
│   └── .env.example              # Backend environment template
│
├── .gitignore                    # Root gitignore rules
├── IMAGE_AUDIT_REPORT.md         # Image audit & verification documentation
├── IMAGE_CREDITS.md              # Image license & attribution registry
├── package.json                  # Root workspace runner scripts
└── README.md                     # Beginner-friendly setup documentation
```

---

## 3. Prerequisites & Environment Setup

Ensure you have the following installed on your system:
- **Node.js:** v18.0.0 or later (v24.20.0 verified)
- **npm:** v9.0.0 or later (v11.19.0 verified)
- **MySQL Community Server:** 8.0 or later running on port `3306`
- **MySQL Workbench:** 8.0 (optional, for inspecting data graphically)

---

## 4. Step-by-Step Installation & Database Setup

### Step 4.1: Configure Backend Environment Variables
Navigate to the `backend` directory and create your `.env` file:
```powershell
cd backend
Copy-Item .env.example .env
```
Open `backend/.env` and enter your MySQL server password:
```env
PORT=5000
NODE_ENV=development

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=explore_india

FRONTEND_URL=http://localhost:3000
```

### Step 4.2: Configure Frontend Environment Variables
Navigate to the `frontend` directory and create your `.env` file:
```powershell
cd ../frontend
Copy-Item .env.example .env
```
Contents of `frontend/.env`:
```env
VITE_API_BASE_URL=/api
```

---

## 5. Database Initialization, Migration & Seeding

Run the following commands inside the `backend` directory (or use root workspace scripts):

### 1. Run Schema Migrations:
Creates the `explore_india` database, schema tables, foreign keys, and unique indexes idempotently:
```powershell
cd backend
npm run migrate
```

### 2. Seed All Tourism Data:
Populates all 28 States, 8 Union Territories, 739 Districts, 172 attractions, Explore destinations, and Top Places:
```powershell
npm run seed
```

### 3. Verify Database Integrity:
Runs automated audit comparing MySQL records against the baseline dataset:
```powershell
npm run verify-data
```

---

## 6. Running the Application

To run the full-stack platform, open two PowerShell terminals:

### Terminal 1 — Start the Backend REST API Server:
```powershell
cd backend
npm run dev
```
- API Server starts on: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`
- Readiness check: `http://localhost:5000/api/ready`

### Terminal 2 — Start the React Frontend:
```powershell
cd frontend
npm run dev
```
- Frontend starts on: `http://localhost:3000`
- Vite automatically proxies `/api/*` requests to the Express backend on port `5000`.

---

## 7. REST API Documentation & Response Contract

All API endpoints return JSON with consistent response envelopes.

### Response Contract Format:
```json
{
  "success": true,
  "data": []
}
```

### Available Endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Check Express server status (`{ success: true, status: "UP" }`) |
| `/api/ready` | GET | Verify MySQL connectivity and schema readiness |
| `/api/states` | GET | List all 28 States and 8 Union Territories (supports `?type=state` or `?type=ut`) |
| `/api/states/:stateSlug` | GET | Retrieve single state details along with its district list |
| `/api/states/:stateSlug/districts` | GET | Retrieve all districts for a specific state |
| `/api/states/:stateSlug/districts/:districtSlug` | GET | Retrieve full district details and local tourist attractions |
| `/api/destinations` | GET | Curated Explore destinations collection (16 destinations) |
| `/api/top-places` | GET | Iconic Top Places collection (16 attractions) |
| `/api/featured` | GET | Homepage advertisement sliders (UTs, Explore, Top Places) |
| `/api/places` | GET | Paginated tourist places list (supports `?category=...&limit=...&page=...`) |
| `/api/places/:id` | GET | Retrieve single tourist attraction by ID |
| `/api/search?q=keyword` | GET | Full-text global search across states, districts, and attractions |

---

## 8. Testing & Production Build

### Running Backend Tests:
```powershell
cd backend
npm test
```
Executes unit tests verifying health, readiness, 404 JSON handling, and search validation.

### Building Frontend for Production:
```powershell
cd frontend
npm run build
npm run preview
```
Compiles optimized production bundles in `frontend/dist/`.

---

## 9. Known Considerations & Preserved Scope

1. **Duplicate District Images:**
   - In accordance with project instructions, duplicate district images across certain administrative districts are intentionally preserved in this phase and will be addressed in a future dedicated geographical image phase.
2. **Local Image Serving:**
   - All images reside in `frontend/public/images/` and are referenced in MySQL as `/images/...` paths, ensuring zero external hotlink blocks or network dependencies.
