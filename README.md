# ⚡ UNIPULSE — Modern College Student Portal

> A unified, full-stack campus platform where students discover clubs, join organizations, register for hackathons and workshops, track weekly competition results, and connect with teammates.

---

## 🚀 Tech Stack (MEAN)

- **MongoDB & Mongoose**: Flexible document database with schemas for users, clubs, events, registrations, results, announcements, connections, and team recruitment posts. Supports automatic embedded in-memory MongoDB fallback with pre-seeded campus data.
- **Express.js & Node.js**: Clean RESTful API architecture with rate limiting, input validation, JWT authentication, and secure password hashing with bcrypt.
- **Angular 18 (Latest Stable)**: Modern frontend with standalone components, Angular Signals for reactive state management, functional HTTP interceptors, route guards, and lazy loading.
- **Tailwind CSS**: Custom dark collegiate aesthetic with modern typography (Inter), glassmorphism, responsive navigation drawers, and interactive micro-animations.

---

## ✨ Features Implemented

### 1. 📊 Student Dashboard
- Dynamic time-based greeting (e.g. *"Good morning, Arjun!"*) with student registration number and branch.
- **Live Stats**: Clubs joined, registered hackathons/events, Campus Pulse points, and peer network count.
- **Upcoming Hackathons & Events Grid**: Countdown badges, venue details, and quick registration.
- **Campus Announcements**: Real-time ticker with priority badges (*Urgent*, *High*, *Normal*).
- **My Clubs Preview**: Direct access to clubs where the student holds active membership.

### 2. 🏛️ Campus Clubs Directory
- Browse official student clubs (e.g., *CodeCraft*, *InnovatAI*, *CyberShield*, *SportSync*, *Rhythm & Rhapsody*, *Green Campus Initiative*).
- Live search by club name and filter pills by category (*Tech*, *Cultural*, *Sports*, *Academic*, *Arts*, *Social*).
- **Club Detail Page**: Full mission statement, member count, coordinators list with avatars, and online links.
- **Application Flow**: "Apply to Join" with custom motivation statement and skill highlights.
- **My Clubs Tab**: One-click switcher to view clubs you have joined or leave a club.

### 3. 📅 Hackathons, Workshops & Events
- Browse upcoming technical hackathons, workshops, and competitions.
- Filter by type (*Hackathons*, *Workshops*, *Competitions*, *Cultural*, *Sports*) and status.
- **Event Detail Page**: Full schedule, dates, registration deadline, venue / online meeting links, and prize pool breakdowns (1st, 2nd, 3rd place cash prizes).
- **Registration Flow**: Support for both **Individual Solo** and **Team Registration** (with team name and teammate registration numbers).
- **My Registrations Tab**: Review registered events and manage registrations with a withdrawal option.

### 4. 🏆 Leaderboards & Competition Results
- **Weekly Winners Hall of Fame**: 1st, 2nd, 3rd place podium cards with trophies, team member roster, project descriptions, and prize awards.
- **Student Leaderboard**: Top campus student contributors ranked by pulse points, with badges (*Campus Grandmaster*, *Hackathon Pro*, etc.).
- **Club Standings**: Campus clubs ranked by total victory points and competition wins.

### 5. 👥 Student Directory & Networking
- **Directory**: Browse college peers by branch and skills (*React*, *Python*, *Machine Learning*, *Figma*, etc.).
- **Peer Connections**: Send connection requests with custom notes; review incoming requests with Accept/Decline actions.
- **Team-Up Board (Teammate Matchmaker)**:
  - Students can publish team recruitment posts (*"Looking for 2 Full-Stack Devs for HackNITR"*).
  - Filter team posts by event or required skills.
  - "Reach Out / Join" modal to connect directly with the team creator.

### 6. 👤 Student Profile & Privacy
- Customizable profile: Bio, branch, year of study, GitHub and LinkedIn links.
- Interactive technical and creative skills tag manager (add/remove skills dynamically).
- **Granular Privacy Controls**: Toggles to show/hide email, phone number, and external links in the public directory.
- Change password flow with validation and first-login security prompt.

---

## 🔑 Demo Student Credentials

All demo students are pre-seeded with the default password: **`UniPulse@123`**

| Registration No. | Student Name | Branch | Year | Special Role |
| :--- | :--- | :--- | :--- | :--- |
| **`21CS001`** | Arjun Sharma | Computer Science | 4 | CodeCraft Lead (450 pts) |
| **`22CS006`** | Kavya Menon | Computer Science | 3 | InnovatAI Lead (380 pts) |
| **`21CI007`** | Vikram Singh | Information Tech | 4 | CyberShield Lead (310 pts) |
| **`21EC003`** | Rohit Kumar | Electronics | 4 | SportSync Lead (280 pts) |
| **`22ME004`** | Sneha Reddy | Mechanical | 3 | Rhythm & Rhapsody Lead |
| **`21EE009`** | Rahul Gupta | Electrical | 4 | Green Campus Lead |

*(Quick-fill demo buttons are provided on the login page for 1-click access!)*

**Admin Account**: `ADMIN001` / `Admin@UniPulse123`

---

## 🛠️ Running the Application

### 1. Backend Server

```bash
cd backend
npm install
npm start
```

- The backend will automatically connect to your local MongoDB at `mongodb://localhost:27017/unipulse`.
- **Zero Configuration**: If a local MongoDB instance is not detected, it automatically launches an embedded in-memory MongoDB server and seeds initial demo data!
- API runs on: **`http://localhost:5000`**

### 2. Frontend Application

```bash
cd frontend
npm install
npm start
```

- Angular development server will launch at: **`http://localhost:4200`**
- All API requests are pre-configured to communicate with `http://localhost:5000/api/v1`.
