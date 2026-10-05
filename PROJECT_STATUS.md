# UNIPULSE — Full-Stack College Student Portal
## Comprehensive Project Status, Architecture & Technical Documentation

> **Last Updated:** October 2026  
> **Status:** Student Portal Feature-Complete (~95%)  
> **Stack:** MEAN (MongoDB, Express.js, Angular 18 Standalone, Node.js)  
> **Frontend URL:** [http://localhost:4200](http://localhost:4200)  
> **Backend API URL:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)  

---

## 1. Executive Summary

**UNIPULSE** is a centralized college student portal designed to replace fragmented campus communication (spreadsheets, chat groups, noticeboards). It provides a unified, professional platform where students can:
1. Discover and join **12 official campus clubs** across technology, culture, sports, arts, and entrepreneurship.
2. Follow and register for **college hackathons, workshops, and competitions** with solo or team rosters and prize pools.
3. Track verified **competition results and live campus leaderboards** (Student Pulse Points & Club Standings).
4. Discover peers in the **Student Directory**, send connection requests, and recruit teammates via the **Hackathon Team-Up Matchmaker**.
5. Customize their student profile, technical skillsets, and directory privacy preferences.

---

## 2. Technology Stack & Design Decisions (What We Used & Why)

### 2.1 Frontend Framework: Angular 18 (Standalone Components)
* **What we used:** Angular 18.2 with Standalone Components, Angular Signals (`signal()`), modern template control flow (`@if`, `@for`, `@let`), Angular Router, and reactive HTTP services.
* **Why we chose it:**
  * **No NgModule Overhead:** Standalone architecture simplifies component isolation, tree-shaking, and lazy routing.
  * **Angular Signals:** Provides fine-grained, frictionless reactivity without unnecessary boilerplate or manual subscription leaks.
  * **Strict Typing & Robust HTTP Interceptors:** Guaranteed contract consistency between backend JSON responses and frontend models via [`models/index.ts`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/frontend/src/app/core/models/index.ts), [`authInterceptor`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/frontend/src/app/core/interceptors/auth.interceptor.ts), and [`errorInterceptor`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/frontend/src/app/core/interceptors/error.interceptor.ts).

### 2.2 Styling & Aesthetics: Tailwind CSS + Custom Obsidian Design System
* **What we used:** Tailwind CSS 3.4 tailored with a custom obsidian dark theme in [`frontend/src/styles.css`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/frontend/src/styles.css).
* **Why we chose it:**
  * **Eliminating "AI Slop":** Standard AI-generated web interfaces rely on cheap neon gradients, garish purple cards, and heavy borders. We engineered a sleek, minimal obsidian palette:
    * Background base: `#08090d`
    * Elevated surface: `#0e1017`
    * Hairline subtle borders: `rgba(255, 255, 255, 0.07)`
    * Frosted glass cards: `.minimal-card` with `backdrop-filter: blur(16px)` and subtle top-edge gradient highlights.
  * **Curated Typography:**
    * **Plus Jakarta Sans:** A geometric, modern sans-serif chosen for high-clarity headings, clean buttons, and readability.
    * **JetBrains Mono:** Used for registration numbers, timestamps, point counters, and technical skill tags.

### 2.3 Interactive UI Effects
* **Floating 3D Geometric Object ([`floating-object.component.ts`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/frontend/src/app/shared/components/floating-object/floating-object.component.ts)):**
  * Features multi-axis gyroscope orbit rings operating in pure CSS 3D perspective (`preserve-3d`), a frosted glass core cube, ambient radial glow, and floating status capsules (`animate-float-slow` and `animate-float-reverse`).
  * Gives the hero section visual sophistication without requiring heavy WebGL/Three.js bundles.
* **Scroll-Reveal Directive ([`scroll-reveal.directive.ts`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/frontend/src/app/shared/directives/scroll-reveal.directive.ts)):**
  * Uses the native browser `IntersectionObserver` API to detect when cards enter the viewport.
  * Triggers smooth hardware-accelerated transforms (`cubic-bezier(0.16, 1, 0.3, 1)`) with staggered delay classes (`delay-1` to `delay-5`) so content flows naturally as the user scrolls.

### 2.4 Backend: Node.js, Express.js & REST API
* **What we used:** Node.js with Express.js, structured into `/models`, `/controllers`, `/routes`, `/middleware`, and `/seed`.
* **Why we chose it:** Lightweight, high-throughput asynchronous request handling with standard REST conventions, JWT middleware, and centralized error handling.

### 2.5 Database: MongoDB with Mongoose ODM & Zero-Config Auto-Fallback
* **What we used:** Mongoose 8.x with an intelligent dual-mode connection manager in [`backend/src/config/db.js`](file:///c:/Users/kumar/OneDrive/Desktop/UniPulse/backend/src/config/db.js).
* **Why we chose it:**
  * **Mode 1 (Standard Local / Atlas Cloud):** Reads `MONGODB_URI` from `.env`. If a local MongoDB Community server or Atlas cluster is available, it connects with standard connection pooling.
  * **Mode 2 (Zero-Config Embedded Engine):** If an external MongoDB server is not running on the host machine, it automatically spins up an embedded **`mongodb-memory-server`** on the fly and auto-seeds the 12 clubs, 10 students, 8 hackathons, and announcements. This allows any developer to test and evaluate the full stack immediately with zero setup.

---

## 3. Module Breakdown & Working Implementation

### 3.1 Authentication & Security (100% Complete)
* **Purpose:** Ensures only verified students access portal resources using college registration numbers.
* **Features:**
  * Registration number login with password hashing via `bcryptjs`.
  * Stateless JWT authentication stored in `localStorage` and dispatched via `authInterceptor`.
  * Route Guards (`AuthGuard`) protecting all portal routes.
  * Mandatory first-time login password change prompt (`mustChangePassword: true`).
  * **One-Click Quick Login Badges:** On the login page, pills allow testers to log in as different students with 1 click.

### 3.2 Dashboard (`/dashboard`) (98% Complete)
* **Purpose:** High-level campus intelligence hub.
* **Features:**
  * Minimal hero banner with the 3D gyroscope orb, dynamic time greeting, and quick action buttons.
  * 4 quick metrics: Clubs Joined, Events Registered, Pulse Points, and Network Size.
  * Active Hackathons & Competitions spotlight.
  * My Active Clubs roster.
  * Live Campus Wire announcements feed.
  * Teammate Matchmaker shortcut.

### 3.3 Campus Clubs Directory (`/clubs` & `/clubs/:id`) (100% Complete)
* **Purpose:** Centralized hub for all student clubs and societies.
* **All 12 Active Campus Clubs Seeded:**
  1. **CodeCraft** (Tech — Competitive Programming & Open Source)
  2. **InnovatAI** (Tech — Machine Learning, Generative AI & Robotics)
  3. **RoboPulse** (Tech — Robotics, Embedded IoT & Hardware Systems)
  4. **CyberShield** (Tech — Cybersecurity, Ethical Hacking & InfoSec)
  5. **PixelCraft Studio** (Arts — UI/UX Design, 3D Art & Creative Media)
  6. **VentureSphere E-Cell** (Academic — Startup Incubation & Pitching)
  7. **Rhythm & Rhapsody** (Cultural — Music, Band Performances & Dance)
  8. **SportSync** (Sports — Athletics, Esports, Cricket & Football)
  9. **Aperture Guild** (Arts — Photography, Cinematography & Video Editing)
  10. **Eloquence Society** (Academic — Debating, Model UN & Literary Arts)
  11. **FinPulse** (Academic — Algorithmic Trading, Web3 & FinTech)
  12. **Green Campus Initiative** (Social — Sustainability & Social Impact)
* **Features:**
  * Search by title/keywords + category filters (Tech, Cultural, Sports, Academic, Arts, Social).
  * Filter by "All Clubs" vs "My Memberships".
  * Detailed club view: Description, founding year, member count, student coordinators, and official portal/Instagram links.
  * Membership Application Modal: Statement of interest, technical skills, and pending review badge.
  * Ability to withdraw / leave club.

### 3.4 Events & Hackathons (`/events` & `/events/:id`) (100% Complete)
* **Purpose:** Discovery, scheduling, and registration for technical hackathons and campus events.
* **Features:**
  * Filter by status (`Upcoming`, `Ongoing`, `Completed`) and format (`Hackathon`, `Workshop`, `Seminar`, `Competition`).
  * Detailed view: Start/end dates, venue, registration deadlines, and online session links.
  * **Prize Showcase:** Visual podium display for 1st Place (🥇), 2nd Place (🥈), and 3rd Place (🥉) with cash prizes and perks.
  * **Solo & Team Registration:** Register as a team by submitting a team name and teammate registration numbers.
  * Registration status badge ("✓ You Are Registered") and withdrawal button.
  * Direct link from team events into the Team-Up board.

### 3.5 Results & Leaderboards (`/results`) (100% Complete)
* **Purpose:** Public recognition of competition winners and campus-wide gamification.
* **Features:**
  * **Tab 1: Competition Results:** Detailed cards showing 1st/2nd/3rd place winners, team names, affiliated clubs, and bonus points won.
  * **Tab 2: Student Leaderboard:** Top campus students ranked by accumulated Campus Pulse Points with gold/silver/bronze badges and branch info.
  * **Tab 3: Club Standings:** Campus clubs ranked by aggregate competition victories and points earned in college hackathons.

### 3.6 Student Network & Team Finder (`/network`) (95% Complete)
* **Purpose:** Connect students across departments and assist solo developers in finding hackathon squads.
* **Features:**
  * **Tab 1: Student Directory:** Search peers by name, skills, or registration number, with branch filters. Send connection requests with personal notes.
  * **Tab 2: Team-Up Board (Hackathon Matchmaker):** Publish team recruitment posts specifying hackathon idea, skills needed (e.g. React, ML, Figma), and squad size. Browse and click "Join Team" to message creators.
  * **Tab 3: Connection Requests:** Accept or decline incoming peer requests, and view active connected peers.

### 3.7 Student Profile (`/profile`) (92% Complete)
* **Purpose:** Self-management of academic profile, technical skillsets, and directory privacy.
* **Features:**
  * Profile header with branch, year, email, registration number, and pulse points.
  * Settings editor: Name, phone, email, branch, year of study, bio, and social links (GitHub, LinkedIn).
  * Interactive skill tag manager (add/remove skills with real-time chip rendering).
  * Directory Privacy Toggles: Toggle whether email, phone number, or external links appear in the public student directory.

---

## 4. Pre-Seeded Accounts for Testing

All test student accounts are seeded with password: **`UniPulse@123`**

| Registration No. | Student Name | Branch & Year | Role / Affiliation |
|---|---|---|---|
| **`21CS001`** | Arjun Sharma | Computer Science (Yr 4) | Lead Coordinator (CodeCraft) |
| **`22CS006`** | Kavya Menon | Computer Science (Yr 3) | Member (InnovatAI, VentureSphere) |
| **`21CI007`** | Vikram Singh | Information Tech (Yr 4) | Coordinator (CyberShield) |
| **`21EC003`** | Rohit Kumar | Electronics (Yr 4) | Coordinator (RoboPulse) |
| **`22IT004`** | Ananya Sen | Information Tech (Yr 3) | Member (PixelCraft Studio) |
| **`23EE008`** | Sneha Patel | Electrical Engg (Yr 2) | Member (Green Campus) |
| **`23ME010`** | Rahul Verma | Mechanical (Yr 2) | Member (SportSync) |

*(Quick 1-click test badges for Arjun, Kavya, Vikram, and Rohit are available directly on the login screen).*

---

## 5. What is Left to Do (Remaining Gaps & Future Roadmap)

### 5.1 Remaining Minor Items in Student Portal Scope (~5%)
1. **Avatar Photo Upload Integration:**
   * Backend route `POST /api/v1/profiles/me/photo` with `multer` storage is implemented.
   * Frontend profile currently displays initial avatars; connecting an HTML file input to trigger `uploadPhoto()` will enable custom picture uploads.
2. **Additional Edge-Case Feedback:**
   * Adding an unread badge indicator on the navbar for incoming connection requests.

### 5.2 Reserved for Phase 2: College Admin Portal
*Per the initial specification, Phase 1 focused strictly on the Student Portal, but all schemas have `role: 'student' | 'admin'` ready.*
* **Future Admin Modules:**
  * **Event Management:** Create/edit new campus events, specify prize tiers, and declare official competition winners.
  * **Club Application Review:** Club coordinators/faculty approving or rejecting pending student applications.
  * **Campus Announcements Broadcast:** Compose and send campus-wide announcements.

### 5.3 Technical Enhancements
* **Real-time WebSockets:** Replace HTTP polling with Socket.io for instantaneous notifications when connection requests or team-up invitations arrive.
* **Automated Test Coverage:** E2E integration test suite using Cypress or Playwright.

---

## 6. How to Run the Project Locally

### Prerequisites
* Node.js v18+ and npm installed.

### 1. Start the Backend API
```powershell
cd c:\Users\kumar\OneDrive\Desktop\UniPulse\backend
npm install
node server.js
```
* Backend runs on **`http://localhost:5000`**.
* If local MongoDB is not running, the server automatically starts the embedded database and logs:
  `✅ Embedded MongoDB running at: mongodb://127.0.0.1:...`

### 2. Start the Frontend Dev Server
```powershell
cd c:\Users\kumar\OneDrive\Desktop\UniPulse\frontend
npm install
npm start -- --port 4200
```
* Open **`http://localhost:4200`** in your browser.
