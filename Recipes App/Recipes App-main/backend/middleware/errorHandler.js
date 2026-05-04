// ============================================================
// middleware/errorHandler.js — Centralised error middleware
// Catches errors forwarded via next(err) from any controller.
// ============================================================

/**
 * Handles Mongoose validation errors with a human-readable message,
 * CastErrors (bad ObjectId), and generic server errors.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Mongoose validation error (e.g. missing required field)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: messages.join('. ') });
  }

  // Mongoose CastError: invalid ObjectId format
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'Invalid recipe ID format' });
  }

  // Fallback: generic server error
  res.status(500).json({ error: 'Internal server error' });
};

module.exports = errorHandler;
