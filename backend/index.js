import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { SEED_CATEGORIES, SEED_PRODUCTS } from "./seedData.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/goldenbee";
const JWT_SECRET = process.env.JWT_SECRET || "goldenbee-secret-change-in-production";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "goldenbee";

console.log("[goldenbee] Admin user=%s, password=%s", ADMIN_USERNAME, ADMIN_PASSWORD ? "***" : "(not set)");

const menuSchema = new mongoose.Schema({
  categories: { type: mongoose.Schema.Types.Mixed, default: [] },
  products: { type: mongoose.Schema.Types.Mixed, default: [] },
  renderPrice: { type: Boolean, default: true },
}, { collection: "menu" });

const Menu = mongoose.model("Menu", menuSchema);

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Не сте најавени" });
  }
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Сесијата истече" });
  }
}

/** Public: get current menu */
app.get("/api/menu", async (req, res) => {
  try {
    let doc = await Menu.findOne();
    if (!doc) {
      doc = await Menu.create({
        categories: SEED_CATEGORIES,
        products: SEED_PRODUCTS,
        renderPrice: true,
      });
    }
    res.json({
      categories: doc.categories || [],
      products: doc.products || [],
      renderPrice: doc.renderPrice !== false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Грешка при вчитување на менито" });
  }
});

/** Admin login */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { sub: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token });
  }
  res.status(401).json({ error: "Погрешно корисничко име или лозинка." });
});

/** Admin: update menu (full replace) */
app.put("/api/menu", authMiddleware, async (req, res) => {
  try {
    const { categories = [], products = [], renderPrice = true } = req.body;
    let doc = await Menu.findOne();
    if (!doc) {
      doc = new Menu({ categories, products, renderPrice });
    } else {
      doc.categories = categories;
      doc.products = products;
      doc.renderPrice = renderPrice;
    }
    await doc.save();
    res.json({
      categories: doc.categories,
      products: doc.products,
      renderPrice: doc.renderPrice,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Грешка при зачувување" });
  }
});

async function start() {
  await mongoose.connect(MONGO_URI);
  const port = process.env.PORT || 3001;
  const host = "0.0.0.0"; // accept connections from other devices (phone, tablet)
  app.listen(port, host, () => {
    console.log(`Golden Bee API: http://localhost:${port}`);
    console.log(`  (from other devices use your computer's IP, e.g. http://192.168.x.x:${port})`);
  });
}

start().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
