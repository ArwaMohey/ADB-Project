// ============================================================
// models/Recipe.js — Mongoose schema for a recipe document
// NoSQL document design: ingredients & instructions are stored
// as plain text (newline-separated) for simplicity and fast
// full-text search without a sub-document overhead.
// ============================================================
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema(
  {
    // Core fields
    name: {
      type: String,
      required: [true, 'Recipe name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // Time & serving info
    prepTime:  { type: Number, min: [0, 'Prep time cannot be negative'],  default: 0 },
    cookTime:  { type: Number, min: [0, 'Cook time cannot be negative'],  default: 0 },
    servings:  { type: Number, min: [1, 'Servings must be at least 1'],   default: 1 },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },

    // Content stored as newline-delimited strings (matches frontend textarea)
    ingredients:  { type: String, default: '', trim: true },
    instructions: { type: String, default: '', trim: true },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
    // Cleaner JSON output: removes __v and renames _id consistently
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret._id = ret._id.toString();
        return ret;
      },
    },
  }
);

// Index for fast text search across name, description and ingredients
RecipeSchema.index(
  { name: 'text', description: 'text', ingredients: 'text' },
  { weights: { name: 10, ingredients: 5, description: 1 } }
);

module.exports = mongoose.model('Recipe', RecipeSchema);
