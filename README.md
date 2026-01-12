# LawLinkLK

Connecting clients with lawyers in Sri Lanka.

LawLinkLK is a secure, full‑stack web platform that bridges the gap between clients seeking legal assistance and qualified lawyers. It provides profile management for lawyers, client–lawyer messaging, case and task management, availability scheduling, meeting (video) signaling, document upload and AI‑assisted summarization, notifications, and more.

- Live site: https://www.lawlinklk.com/
- Tech stack: React + Vite, Material UI, Tailwind CSS, Zustand, Socket.io, Node.js/Express, MongoDB/Mongoose, JWT, Google Generative AI + TTS

---

## Features

- Authentication and roles
  - Client and Lawyer authentication (JWT-based)
  - Lawyer profile and data management
- Secure messaging
  - Real‑time, user‑to‑user chat via Socket.io
  - File uploads for chat (images/docs)
- Case and productivity tools
  - Case management (create, update, track)
  - Tasks, Notes, Todos
  - Availability and scheduling
  - Email notifications
- Meetings
  - Socket.io signaling for WebRTC meetings (offer/answer/ICE)
- Documents and AI
  - PDF uploads and parsing
  - AI‑powered summarization (Google Generative AI)
  - Optional text‑to‑speech (Google Cloud TTS)
- Platform safety
  - CORS allowlist and rate limiting
  - Input validation (express-validator)

---

## Repository structure

```
LAWLINK--LK/
├─ Backend/
│  ├─ server.js
│  ├─ db/
│  │  └─ connectTomongoDB.js
│  ├─ routes/
│  │  ├─ auth.route.js
│  │  ├─ availability.route.js
│  │  ├─ case.route.js
│  │  ├─ chatbot.route.js
│  │  ├─ lawyer.route.js
│  │  ├─ lawyerAuth.route.js
│  │  ├─ meeting.route.js
│  │  ├─ message.route.js
│  │  ├─ note.route.js
│  │  ├─ notification.route.js
│  │  ├─ summarization.route.js
│  │  ├─ tasks.route.js
│  │  └─ todo.route.js
│  └─ uploads/ ... (created at runtime)
├─ Frontend/
│  ├─ src/ ... (React + Vite app)
│  └─ package.json
├─ ChatbotFiles/ ... (chatbot related resources)
├─ package.json          (root scripts; runs backend)
├─ package-lock.json
├─ jest.config.js
└─ README.md
```

---

## Architecture overview

- Frontend (Vite + React)
  - UI: Material UI, Tailwind CSS
  - State: Zustand
  - Routing: React Router
  - Realtime: socket.io-client
- Backend (Node.js + Express)
  - REST APIs under `/api/*`
  - Socket.io server on same HTTP server
  - MongoDB via Mongoose
  - JWT authentication and cookies
  - File uploads via multer/express-fileupload
- Realtime & meetings
  - Socket rooms per meeting; events: `offer`, `answer`, `ice-candidate`, `user-joined`, `user-left`
- AI services
  - Google Generative AI for summarization
  - Google Cloud Text‑to‑Speech (optional)
- Storage
  - MongoDB Atlas or self-managed MongoDB
  - Static hosting of uploads under `/uploads` and `/audio`

---

## Getting started

### Prerequisites

- Node.js 18+ (recommended 18 LTS or 20)
- npm 9+ or pnpm/yarn
- MongoDB connection string
- API keys (if using AI/TTS features)

### 1) Clone

```bash
git clone https://github.com/Thisal005/LAWLINK--LK.git
cd LAWLINK--LK
```

### 2) Install dependencies

- Backend dependencies are referenced at the repository root (the backend is started from root):

```bash
# from project root
npm install
```

- Frontend:

```bash
cd Frontend
npm install
cd ..
```

### 3) Environment variables

Create a `.env` file at the repository root with values for your environment.

Example `.env` (adjust as needed):

```env
# Server
PORT=5000
NODE_ENV=development

# Origins (CORS allowlist)
LOCAL_URL=http://localhost:5173
PRODUCTION_URL=https://www.lawlinklk.com
VERCEL_URL=

# Database
MONGO_DB_URL=mongodb+srv://<user>:<pass>@<host>/<db>?retryWrites=true&w=majority

# Auth & Security
JWT_SECRET=replace_with_long_random_secret

# Email (optional, for notifications)
EMAIL_USER=you@example.com
EMAIL_PASS=app_password_or_secret

# Google Generative AI
GOOGLE_API_KEY=your_google_generative_ai_key

# Google Cloud TTS (if used; or set via GOOGLE_APPLICATION_CREDENTIALS file)
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_TTS_LOCATION=global
```

Notes:
- If you deploy to a host that uses service account credentials for Google Cloud TTS, set `GOOGLE_APPLICATION_CREDENTIALS` to a JSON key path in the environment instead of placing it in the repo.
- The backend uses an allowlist CORS function. Ensure your local and production origins are present in `LOCAL_URL` and `PRODUCTION_URL`.

### 4) Run in development

- Start backend (from project root):

```bash
npm run server
```

This launches Express + Socket.io (default on port 5000) and connects to MongoDB.

- Start frontend:

```bash
cd Frontend
npm run dev
```

Frontend runs on Vite (default http://localhost:5173) and calls the backend at your configured API URL.

---

## API surface (high-level)

Base URL: `http://localhost:5000/api`

- Auth: `/auth` — login, signup, token management
- Users: `/user`
- Lawyers: `/lawyer` (auth) and `/lawyer-data` (profiles/data)
- Messages: `/messages` — real‑time chat support via Socket.io
- Cases: `/case`
- Tasks: `/tasks`
- Notes: `/notes`
- Todos: `/todos`
- Notifications: `/notifications`
- Meetings: `/meetings` — Socket.io signaling endpoints
- Availability: `/availability`
- Summarization: `/summarization` — AI document summarization
- Chatbot: `/chatbot` — AI chatbot endpoints

Uploads served from:
- `/uploads` (static root)
- `/uploads/chat`
- `/uploads/pdf`
- `/audio`

Socket.io events:
- Connection query: `userId` (required to map socket to user)
- Chat: `newMessage`
- Meetings: `join-meeting`, `offer`, `answer`, `ice-candidate`, `leave-meeting`, and corresponding broadcast events

---

## Security and privacy

- JWT-based authentication with cookies
- Rate limiting for high‑risk endpoints
- Input validation using `express-validator`
- CORS restricted to allowed origins
- Avoid committing secrets; use environment variables or your platform’s secret manager
- Uploaded files are publicly served; do not upload sensitive data without encryption/authorization checks

---

## Scripts

- Backend (from project root)
  - `npm run server` — start backend with nodemon (development)

- Frontend (from Frontend/)
  - `npm run dev` — Vite dev server
  - `npm run build` — production build
  - `npm run preview` — preview production build

---

## Troubleshooting

- CORS error in browser devtools
  - Ensure your frontend origin is included in `LOCAL_URL` (and `PRODUCTION_URL` if testing production URL locally)
- WebSocket cannot connect
  - Confirm the Socket.io server is running and `userId` is passed in the connection query
- MongoDB connection fails
  - Verify `MONGO_DB_URL` and your network allowlist settings on MongoDB Atlas
- Summarization/Chatbot errors
  - Check `GOOGLE_API_KEY` validity and required quotas
- TTS not working
  - Ensure Google Cloud project IAM and credentials are correctly configured

---



## Acknowledgements

- [Vite](https://vitejs.dev/), [React](https://react.dev/), [Material UI](https://mui.com/)
- [Socket.io](https://socket.io/), [Mongoose](https://mongoosejs.com/)
- [Google Generative AI](https://ai.google.dev/), [Google Cloud Text‑to‑Speech](https://cloud.google.com/text-to-speech)
