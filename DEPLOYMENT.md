# Golden Bee — Deployment Guide

Frontend → **Vercel** | Backend → **Contabo VPS**

---

## 1. Backend on Contabo VPS

### Prerequisites
- SSH access to your Contabo VPS
- Node.js 18+ installed
- MongoDB running (local or on the same VPS)
- PM2 installed globally (`npm install -g pm2`)

### Steps

**1. Clone the repo on the VPS** (or pull if already there)
```bash
cd /path/to/your/apps
git clone https://github.com/Slobodan-Krdzev/goldenBee.git
cd goldenBee/backend
```

**2. Install dependencies**
```bash
npm install --production
```

**3. Create `.env`**
```bash
cp .env.example .env
nano .env
```

Set:
```
MONGO_URI=mongodb://127.0.0.1:27017/goldenbee
JWT_SECRET=your-strong-random-secret-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
PORT=3001
```

Use your existing MongoDB URI if Golden Bee should use a shared instance. Create a new database name (e.g. `goldenbee`) or use an existing one.

**4. Open port 3001** (if using a firewall)
```bash
# UFW example
sudo ufw allow 3001
sudo ufw reload
```

**5. Start with PM2**
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # run the command it prints to enable startup on reboot
```

**6. Verify**
```bash
curl http://localhost:3001/api/menu
```

From your machine:
```bash
curl http://YOUR_VPS_IP:3001/api/menu
```

**7. Import menu data** (if you have an exported JSON)
- Log in to the Vercel frontend as admin
- Go to Admin → "Увези од JSON" and upload your `goldenbee-menu-*.json` file

---

## 2. Frontend on Vercel

### Prerequisites
- Vercel account
- Project connected to your Git repo

### Steps

**1. In Vercel project settings → Environment Variables**, add:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | *(leave empty or unset)* | Use same-origin proxy (recommended for HTTPS) |
| `BACKEND_URL` | `http://YOUR_VPS_IP:3001` | Backend URL for the Vercel proxy (used by `vercel.ts`) |

Replace `YOUR_VPS_IP` with your Contabo VPS public IP (e.g. `http://75.119.159.245:3001`).

**2. Deploy**
- Push to your main branch, or trigger a deploy from the Vercel dashboard
- Vercel will proxy `/api/*` to your backend via `vercel.ts` rewrites
- The frontend uses same-origin `/api/...` calls, avoiding mixed content (HTTPS → HTTP) errors

**3. Alternative: direct backend URL**
- If you prefer the frontend to call the backend directly (e.g. backend has HTTPS), set:
  - `VITE_API_URL=https://api.yourdomain.com` (or your API URL)
  - `BACKEND_URL` is not used in that case
- Redeploy

---

## 3. Quick reference

| Item | Value |
|------|-------|
| Backend URL | `http://YOUR_VPS_IP:3001` |
| Vercel proxy | `/api/*` → backend (via `vercel.ts`, configurable with `BACKEND_URL`) |
| API endpoints | `GET /api/menu`, `POST /api/login`, `PUT /api/menu` |
| Admin | `/edit` — username/password from `backend/.env` |

---

## 4. PM2 commands

```bash
pm2 list              # list processes
pm2 logs goldenbee-api
pm2 restart goldenbee-api
pm2 stop goldenbee-api
```

---

## 5. Updating the backend

```bash
cd /path/to/goldenBee
git pull
cd backend
npm install --production
pm2 restart goldenbee-api
```

---

## 6. Login not working (“Погрешно корисничко име или лозинка”)

1. **Full reload** — `pm2 restart` does NOT re-read `.env`. Use:
   ```bash
   cd /var/www/goldenbee/goldenBee/backend
   pm2 delete goldenbee-api
   pm2 start ecosystem.config.cjs
   pm2 save
   ```

2. **Verify credentials in logs**: `pm2 logs goldenbee-api --lines 20` — you should see `Admin user=admin, password=***`. If `(not set)`, `.env` is not loading.

3. **Check `.env`** — no spaces around `=`, no quotes. Use the exact password from your `.env`.

4. **Test login from VPS** (use the password from your `.env`):
   ```bash
   curl -X POST http://127.0.0.1:3001/api/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"YOUR_PASSWORD_FROM_ENV"}'
   ```
   If curl returns `{"token":"..."}`, the backend is correct. If it fails, the password in `.env` does not match.
