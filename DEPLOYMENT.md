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
```
VITE_API_URL=http://YOUR_VPS_IP:3001
```
Replace `YOUR_VPS_IP` with your Contabo VPS public IP.

**2. Deploy**
- Push to your main branch, or trigger a deploy from the Vercel dashboard
- Vercel will build with `VITE_API_URL` and the frontend will call your backend

**3. If you use a domain later**
- Update `VITE_API_URL` to `https://api.yourdomain.com` (or your API URL)
- Redeploy

---

## 3. Quick reference

| Item | Value |
|------|-------|
| Backend URL | `http://YOUR_VPS_IP:3001` |
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
