# 🎮 TheLastOfGuss – Frontend

This is the frontend for **TheLastOfGuss**, a tap-based goose game powered by React and Vite.

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

## 🔁 Backend Proxy

The Vite dev server is configured to proxy all `/api` requests to the backend at `http://localhost:3000`.

No additional setup is required — the proxy works out of the box.

---

## 🧩 Stack

- ⚛️ React (with TypeScript)
- ⚡ Vite
- 🎨 CSS modules (lightweight styling)
- 🗂️ React Router
- 🍪 JWT auth via HTTP-only cookies

---

## ✨ Features

- Stateless authentication via cookies
- Minimal setup, no build configuration required
- Fully client-side state management
- Tap tracking and local score calculation
- Dynamic round UI based on backend status
- Context-based global auth state (`username`, `score`, etc.)

---

## ⚠️ Notes

- Round timers, transitions, and game logic use **hardcoded timeouts** defined in constants.
- These values are not externally configurable yet — no admin UI or `.env` overrides.
- The app assumes the backend is already running at `http://localhost:3000`.

---

## 📁 Project Structure

```
src/
├── api.ts              # API calls to backend
├── context/            # Auth context (username, score)
├── pages/
│   ├── Rounds.tsx      # Round list & admin UI
│   ├── Round.tsx       # Main game screen
│   └── Login.tsx       # Login page (Homepage)
├── assets/             # Goose images
├── main.tsx            # App entry
└── App.tsx             # Router and layout
```

---

## ✅ Requirements

- Node.js 18+
- Backend must be running on port `3000` locally
