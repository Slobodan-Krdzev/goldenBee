# Golden Bee — Online Menu

A mobile-first React + TypeScript + Tailwind CSS web app for the **Golden Bee** healthy snack bar. Public menu view and an admin area to manage categories, products, and price visibility.

**With the backend:** Menu data is stored in MongoDB. When the admin changes the menu, all users see the update as soon as they load or refresh the menu.

**Without the backend:** Run only the frontend; menu and login state use `localStorage` (per device).

---

## Project structure

```
frontend/     React (Vite) app — UI and menu display
backend/      Express API + MongoDB — menu storage and admin auth
```

---

## Run with backend (shared menu for all users)

1. **MongoDB** must be running locally (e.g. `mongodb://127.0.0.1:27017`).

2. **Install dependencies (once):**
   ```bash
   npm run install:all
   ```
   Or manually: `npm install --prefix frontend` and `npm install --prefix backend`.

3. **Backend env:** Copy and edit if needed:
   ```bash
   cp backend/.env.example backend/.env
   ```

4. **Frontend env** (so the app talks to the API):
   ```bash
   cp frontend/.env.example frontend/.env
   # .env should contain: VITE_API_URL=http://localhost:3001
   ```

5. **Start backend and frontend** (two terminals):

   **Terminal 1 — API**
   ```bash
   npm run dev:server
   ```
   API: [http://localhost:3001](http://localhost:3001).

   **Terminal 2 — Frontend**
   ```bash
   npm run dev
   ```
   App: [http://localhost:5173](http://localhost:5173).

6. **Admin** at `/edit`: username `admin`, password `goldenbee` (or values from `backend/.env`).

---

## Run without backend (local only)

- Do **not** set `VITE_API_URL` in `frontend/.env` (or leave `frontend/.env` absent).
- From project root:
  ```bash
  npm run install:all
  npm run dev
  ```
- Or from `frontend/`: `npm install && npm run dev`.

---

## Scripts (from project root)

| Command           | Description                    |
|------------------|--------------------------------|
| `npm run dev`    | Start frontend (Vite)          |
| `npm run dev:server` | Start backend (Express)   |
| `npm run build`  | Build frontend for production  |
| `npm run start:server` | Run backend (no watch)     |
| `npm run install:all` | Install deps in root, frontend, backend |

---

## Build for production

```bash
npm run build
```

Output is in `frontend/dist/`. Set `VITE_API_URL` in `frontend/.env` to your API URL before building.

---

## Deployment (Contabo VPS + Vercel)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions to deploy the backend on Contabo and the frontend on Vercel.

---

## Routes

| Path   | Description                    |
|--------|--------------------------------|
| `/`    | Public menu (categories + products) |
| `/edit`| Admin: categories, products, “Render Prices” toggle |

---

## Tech stack

- **Frontend:** React 19, TypeScript, Vite 7, React Router 7, Tailwind CSS 4
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT for admin auth

## Folder structure

```
frontend/
  src/
    api/         client.ts (fetch menu, login, save menu)
    components/  CategorySection, ProductItem, LoginForm, ToggleSwitch, Header
    context/     MenuContext (state + API or localStorage)
    data/        seedMenu.ts (default menu)
    pages/       MenuPage, AdminPage
    types/       menu.types.ts
  index.html, vite.config.ts, package.json, .env

backend/
  index.js       Express API (GET/PUT /api/menu, POST /api/login)
  seedData.js    Default categories & products
  package.json, .env
```
