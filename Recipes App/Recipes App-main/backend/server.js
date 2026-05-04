// ============================================================
// server.js — Express application entry point
// ============================================================
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const rateLimit    = require('express-rate-limit');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Connect to MongoDB ─────────────────────────────────────
connectDB();

// ── CORS ───────────────────────────────────────────────────
// In production, replace the array with your actual frontend origin(s).
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : [];

app.use(cors({
  origin(origin, callback) {
    // Allow requests with no Origin header (e.g. same-origin, curl, Postman)
    // and explicitly listed origins. Deny everything else.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
}));

// ── Rate limiting ──────────────────────────────────────────
// Limits each IP to 100 requests per 15 minutes to prevent abuse.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// ── Body parsing ───────────────────────────────────────────
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/recipes', require('./routes/recipes'));

// Health check — used by Docker / load balancers
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── Error handling (must be last middleware) ───────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`RecipeVault API running on port ${PORT}`);
});
