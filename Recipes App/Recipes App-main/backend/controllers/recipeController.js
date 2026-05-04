// ============================================================
// controllers/recipeController.js — CRUD handlers for recipes
// Follows MVC: each export maps 1-to-1 to a route action.
// ============================================================
const Recipe = require('../models/Recipe');

// Valid category values (mirrors the Mongoose enum)
const VALID_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'];

// Escape special regex characters to prevent regex injection
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Sanitise and type-cast the fields accepted from request bodies
function sanitiseRecipeBody(body) {
  return {
    name:         body.name         != null ? String(body.name).trim()         : undefined,
    category:     VALID_CATEGORIES.includes(body.category) ? body.category     : undefined,
    description:  body.description  != null ? String(body.description).trim()  : undefined,
    prepTime:     body.prepTime     != null ? Number(body.prepTime)             : undefined,
    cookTime:     body.cookTime     != null ? Number(body.cookTime)             : undefined,
    servings:     body.servings     != null ? Number(body.servings)             : undefined,
    difficulty:   ['Easy', 'Medium', 'Hard'].includes(body.difficulty) ? body.difficulty : undefined,
    ingredients:  body.ingredients  != null ? String(body.ingredients).trim()  : undefined,
    instructions: body.instructions != null ? String(body.instructions).trim() : undefined,
  };
}

// ── READ: GET /api/recipes ─────────────────────────────────
// Optional query params: ?search=<term>&category=<cat>
exports.getRecipes = async (req, res, next) => {
  try {
    const query = {};

    // Validate category against known enum to prevent injection
    const category = req.query.category;
    if (category) {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: 'Invalid category value' });
      }
      query.category = category;
    }

    // Escape search term and build safe regex query
    const search = req.query.search;
    if (search) {
      const safeSearch = escapeRegex(String(search).slice(0, 200)); // cap length
      query.$or = [
        { name:        { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { ingredients: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    // db.recipes.find(query).sort({ createdAt: -1 })
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    next(err);
  }
};

// ── READ: GET /api/recipes/:id ─────────────────────────────
exports.getRecipe = async (req, res, next) => {
  try {
    // db.recipes.findOne({ _id: ObjectId(id) })
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

// ── CREATE: POST /api/recipes ──────────────────────────────
exports.createRecipe = async (req, res, next) => {
  try {
    // Sanitise input then let Mongoose validate against schema
    const data = sanitiseRecipeBody(req.body);
    // db.recipes.insertOne(data)
    const recipe = await Recipe.create(data);
    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};

// ── UPDATE: PUT /api/recipes/:id ───────────────────────────
exports.updateRecipe = async (req, res, next) => {
  try {
    // Sanitise and whitelist updatable fields — prevents _id / timestamp tampering
    const updates = sanitiseRecipeBody(req.body);

    // db.recipes.updateOne({ _id }, { $set: updates })
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }   // return updated doc & re-validate
    );
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
};

// ── DELETE: DELETE /api/recipes/:id ───────────────────────
exports.deleteRecipe = async (req, res, next) => {
  try {
    // db.recipes.deleteOne({ _id })
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    next(err);
  }
};
