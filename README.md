# ⚡ UniPulse — Modern Campus Student Ecosystem & Portal

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18.2-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 18" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.19-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License: MIT" />
</p>

<p align="center">
  <strong>UniPulse</strong> is an all-in-one, full-stack campus intelligence and collaboration platform designed for university students. It bridges the gap between campus organizations, hackathons, academic competitions, peer networking, and student skill discovery through a sleek, reactive dark-mode interface.
</p>

---

## 🌟 Key Highlights

- ⚡ **Full MEAN Stack Architecture**: Built on MongoDB, Express.js, Angular 18 (Standalone & Signals), and Node.js.
- 🛡️ **Zero-Config In-Memory Fallback**: Runs out of the box with embedded `mongodb-memory-server` and rich demo seed data—no external MongoDB installation required!
- 🎨 **Modern Collegiate UI**: Custom dark glassmorphic design system crafted with Tailwind CSS, micro-interactions, responsive sidebars, and smooth scroll animations.
- 🤝 **Hackathon Matchmaker**: Dedicated team-up board to recruit teammates with specific skill tags (React, Machine Learning, UI/UX, etc.).
- 💬 **Peer Messaging**: Direct one-to-one communication between connected campus peers.
- 🔍 **Live Database Inspector**: Built-in developer dashboard to inspect MongoDB collections, document counts, and manage data live from the browser.

---

## 🛠️ Technology Stack

### **Frontend**
| Technology | Description |
| :--- | :--- |
| **Angular 18** | Modern reactive framework using **Standalone Components**, **Angular Signals** for state management, and modern control flow (`@if`, `@for`). |
| **TypeScript 5.5** | Strictly typed codebase with comprehensive interfaces for models, API payloads, and state. |
| **Tailwind CSS 3.4** | Utility-first styling with custom colors, dark palette, glassmorphism, and responsive layouts. |
| **RxJS 7.8** | Reactive stream processing for asynchronous HTTP calls and event handling. |
| **Angular Router** | Lazy-loaded routes with functional guards (`authGuard`, `publicGuard`). |

### **Backend**
| Technology | Description |
| :--- | :--- |
| **Node.js & Express 4** | Modular RESTful API structured with controllers, services, middleware, and route handlers. |
| **MongoDB & Mongoose 8** | ODM supporting indexed schemas, virtuals, and relational references across 10+ models. |
| **In-Memory MongoDB** | `mongodb-memory-server` provides instant, local zero-setup fallback with automated seeding. |
| **JWT & Bcrypt.js** | Stateless JSON Web Token authentication with salt-hashed password security. |
| **Security Suite** | Hardened with **Helmet** (HTTP headers), **CORS**, **express-rate-limit**, and **express-validator**. |
| **Multer** | Multi-part file upload support for student profile photos. |

---

## ✨ Features & Modules

### 1. 📊 Interactive Student Dashboard (`/dashboard`)
- **Dynamic Time Greeting**: Contextual greeting (*"Good morning, Arjun!"*) with student registration number and branch.
- **Campus Pulse Metrics**: Live counters for joined clubs, registered events, accumulated Pulse Points, and network size.
- **Spotlight Feed**: Highlights trending campus hackathons, recent club updates, and urgent announcements.
- **Quick Actions**: One-click shortcuts to explore clubs, register for events, or pitch team-up posts.

### 2. 🏛️ Campus Clubs Directory (`/clubs` & `/clubs/:id`)
- **Comprehensive Catalog**: 12 pre-seeded campus organizations across **Technical**, **Cultural**, **Sports**, **Academic**, **Arts**, and **Social Impact**.
- **Real-Time Filtering**: Instant text search by club name and filter pills by category.
- **Club Dossier**: Mission statements, member rosters, executive coordinators, and social links.
- **Membership Application**: Apply with custom motivation statements; status tracking (*Pending*, *Approved*, *Active Member*), and membership resignation flow.

### 3. 📅 Hackathons, Workshops & Competitions (`/events` & `/events/:id`)
- **Format & Status Filters**: Filter by event type (*Hackathons, Workshops, Seminars, Competitions*) and status (*Upcoming, Ongoing, Completed*).
- **Prize Podium Breakdown**: Visual showcase of 1st, 2nd, and 3rd place cash prizes, certificates, and perks.
- **Flexible Registration Engine**:
  - **Solo Registration**: 1-click registration for individual participants.
  - **Team Registration**: Submit team name and teammate college registration numbers.
- **Registration Management**: View your registered events with instant withdrawal controls.

### 4. 🏆 Leaderboards & Competition Results (`/results`)
- **Weekly Winners Hall of Fame**: Podium cards showcasing winning teams, project descriptions, awards, and affiliated clubs.
- **Student Leaderboard**: Campus-wide student ranking based on accumulated **Pulse Points**, featuring achievement tiers (*Grandmaster*, *Pro*, *Rising Star*).
- **Club Standings**: Institutional rankings reflecting total competition victories and aggregate student points.

### 5. 👥 Campus Networking & Hackathon Team-Up (`/network`)
- **Student Directory**: Discover peers across branches and filter by technical skills (*Python, Flutter, Solidity, Figma, etc.*).
- **Peer Connections**: Send personalized connection requests, accept/decline incoming invites, and view your active network.
- **Team-Up Matchmaker**:
  - Publish recruitment posts specifying project goals, needed roles, and required skills.
  - Browse openings and send direct join requests to team leaders.

### 6. 💬 Direct Peer Messaging (`/messages`)
- Direct private messaging interface between connected campus students.
- Real-time conversation threads with message history and intuitive chat bubble layout.

### 7. 🎓 MVGR Campus Hub (`/mvgr-hub`)
- Centralized hub for institution-specific resources, academic links, departmental shortcuts, and official campus utilities.

### 8. 🔍 Live Database Inspector (`/db-inspector`)
- Developer and tester tool for inspecting live MongoDB collections.
- View document counts, inspect individual records in JSON format, and trigger full database re-seeding with a single click.

### 9. 👤 Profile & Privacy Settings (`/profile`)
- Complete student portfolio: Bio, branch, year of study, GitHub, and LinkedIn profiles.
- **Interactive Skill Tag Manager**: Dynamically add and remove skills with chip badges.
- **Granular Directory Privacy**: Toggles to selectively show or hide email, phone numbers, and external profiles from the public directory.
- Password change interface with mandatory first-login password update enforcement.

---

## 📂 Project Architecture

```
UniPulse/
├── backend/
│   ├── src/
│   │   ├── config/             # Database connection & memory-server setup
│   │   ├── controllers/        # Request handlers (auth, clubs, events, results, chat, etc.)
│   │   ├── middleware/         # JWT verification, role-based access, rate-limiting, error handling
│   │   ├── models/             # Mongoose schemas (User, Club, Event, Result, Message, etc.)
│   │   ├── routes/             # Express API routes
│   │   ├── seed/               # Default JSON data & seeder scripts
│   │   ├── services/           # Business logic & notification/matching services
│   │   └── utils/              # ApiError, asyncHandler, and pagination helpers
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── server.js               # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Guards, HTTP interceptors, services, and models
│   │   │   ├── features/       # Feature modules (auth, dashboard, clubs, events, chat, etc.)
│   │   │   └── shared/         # Reusable UI components (navbar, footer, toast, layout)
│   │   ├── environments/       # Environment configuration files
│   │   ├── styles.css          # Global Tailwind CSS and design tokens
│   │   └── main.ts             # Angular bootstrap
│   ├── angular.json
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore                  # Git exclusions for dependencies and sensitive files
└── README.md
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/auth/login` | Authenticate student via Reg. No. and password | ❌ |
| `POST` | `/api/v1/auth/register` | Register new student account | ❌ |
| `POST` | `/api/v1/auth/change-password` | Update account password | ✅ |
| `GET` | `/api/v1/clubs` | List all campus clubs with filters | ✅ |
| `GET` | `/api/v1/clubs/:id` | Retrieve club profile & coordinators | ✅ |
| `POST` | `/api/v1/clubs/:id/apply` | Submit membership application | ✅ |
| `GET` | `/api/v1/events` | List hackathons, workshops & competitions | ✅ |
| `POST` | `/api/v1/events/:id/register` | Register solo or as a team | ✅ |
| `GET` | `/api/v1/results` | Competition winners, student & club leaderboards | ✅ |
| `GET` | `/api/v1/connections` | Peer connections & pending invitations | ✅ |
| `POST` | `/api/v1/connections/request` | Send connection request to a student | ✅ |
| `GET` | `/api/v1/team-posts` | List open hackathon team openings | ✅ |
| `POST` | `/api/v1/team-posts` | Publish a new team-up recruitment post | ✅ |
| `GET` | `/api/v1/messages/:peerId` | Retrieve chat history with a peer | ✅ |
| `POST` | `/api/v1/messages` | Send direct message to a peer | ✅ |
| `GET` | `/api/v1/database/stats` | Live collection counts for Database Inspector | ✅ |

---

## 🔑 Demo Test Accounts

The platform includes pre-seeded student accounts for immediate testing. All demo accounts use the default password:

> **Default Password:** `UniPulse@123`

| Registration No. | Student Name | Branch & Year | Role / Affiliation |
| :--- | :--- | :--- | :--- |
| **`21CS001`** | Arjun Sharma | Computer Science (Yr 4) | Lead Coordinator — CodeCraft *(450 pts)* |
| **`22CS006`** | Kavya Menon | Computer Science (Yr 3) | Lead Coordinator — InnovatAI *(380 pts)* |
| **`21CI007`** | Vikram Singh | Information Tech (Yr 4) | Lead Coordinator — CyberShield *(310 pts)* |
| **`21EC003`** | Rohit Kumar | Electronics (Yr 4) | Lead Coordinator — SportSync *(280 pts)* |
| **`22ME004`** | Sneha Reddy | Mechanical (Yr 3) | Lead Coordinator — Rhythm & Rhapsody |
| **`21EE009`** | Rahul Gupta | Electrical (Yr 4) | Lead Coordinator — Green Campus Initiative |

*(💡 Quick-fill demo badges are provided on the login page for 1-click instant login).*

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* Local MongoDB running on `mongodb://localhost:27017/unipulse` (UniPulse automatically runs an in-memory database if no local instance is found).

---

### 1. Clone the Repository
```bash
git clone https://github.com/phani-001/UniPulse.git
cd UniPulse
```

---

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server (runs on http://localhost:5000)
npm start
```

> **Note:** On launch, the server will check for MongoDB. If a local MongoDB instance is not detected, it automatically spins up an in-memory database server and pre-seeds all demo clubs, events, results, and student profiles!

---

### 3. Frontend Setup
In a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
```

Open your browser and navigate to:
```
http://localhost:4200
```

---



---



<p align="center">
  Crafted with ❤️ for modern university students.
</p>
