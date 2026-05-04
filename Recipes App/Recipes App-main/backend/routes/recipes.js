// ============================================================
// routes/recipes.js — RESTful recipe endpoints
// Maps HTTP verbs + paths → controller functions
// ============================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/recipeController');

// GET    /api/recipes        → list all (with optional search/category filters)
// POST   /api/recipes        → create new recipe
router.route('/')
  .get(ctrl.getRecipes)
  .post(ctrl.createRecipe);

// GET    /api/recipes/:id    → get single recipe
// PUT    /api/recipes/:id    → update recipe
// DELETE /api/recipes/:id    → delete recipe
router.route('/:id')
  .get(ctrl.getRecipe)
  .put(ctrl.updateRecipe)
  .delete(ctrl.deleteRecipe);

module.exports = router;
