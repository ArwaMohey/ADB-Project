// ============================================================
// seed.js — Populates MongoDB with sample recipes
// Run once: node seed.js
// Safe to re-run: skips seeding if collection already has data
// ============================================================
require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Recipe = require('./models/Recipe');

const SEEDS = [
  {
    name: 'Shakshuka',
    category: 'Breakfast',
    description: 'Poached eggs in spiced tomato and pepper sauce, a classic Middle Eastern dish.',
    prepTime: 10, cookTime: 25, servings: 4, difficulty: 'Easy',
    ingredients: '2 tbsp olive oil\n1 onion, diced\n3 garlic cloves\n2 cans crushed tomatoes\n1 tsp cumin\n1 tsp paprika\n4 eggs\nFresh parsley',
    instructions: 'Heat oil in a skillet\nSauté onion and garlic until soft\nAdd tomatoes and spices, simmer 15 mins\nMake wells and crack eggs in\nCover and cook 8 mins\nGarnish with parsley',
  },
  {
    name: 'Koshari',
    category: 'Dinner',
    description: "Egypt's national dish — rice, lentils, pasta with a tangy tomato sauce.",
    prepTime: 20, cookTime: 45, servings: 6, difficulty: 'Medium',
    ingredients: '1 cup rice\n1 cup lentils\n1 cup elbow pasta\n3 onions\n1 can tomato sauce\n4 garlic cloves\n1 tsp cumin\nOil for frying',
    instructions: 'Cook rice and lentils separately\nBoil pasta until al dente\nFry onions until crispy\nMake tomato garlic sauce\nLayer rice+lentils then pasta\nTop with sauce and crispy onions',
  },
  {
    name: 'Om Ali',
    category: 'Dessert',
    description: 'Egyptian bread pudding with nuts, coconut, and cream — a beloved classic.',
    prepTime: 15, cookTime: 30, servings: 8, difficulty: 'Easy',
    ingredients: '4 croissants\n2 cups milk\n1 cup heavy cream\n1/2 cup sugar\n1/2 cup mixed nuts\n1/4 cup coconut flakes\nCinnamon',
    instructions: 'Preheat oven to 180°C\nTear croissants into pieces\nMix milk cream and sugar\nLayer bread in baking dish\nPour cream mixture over\nTop with nuts and coconut\nBake 25 mins until golden',
  },
  {
    name: 'Falafel Wrap',
    category: 'Lunch',
    description: 'Crispy fried chickpea patties wrapped in flatbread with tahini and veggies.',
    prepTime: 20, cookTime: 15, servings: 4, difficulty: 'Medium',
    ingredients: '400g canned chickpeas\n1 onion\n3 garlic cloves\n1 tsp cumin\n1 tsp coriander\nFlat bread\nTahini\nTomatoes, lettuce',
    instructions: 'Blend chickpeas with onion and spices\nForm into small patties\nFry until golden brown\nWarm flatbreads\nAssemble with tahini and vegetables',
  },
];

async function seed() {
  await connectDB();

  const count = await Recipe.countDocuments();
  if (count > 0) {
    console.log(`Database already has ${count} recipes — skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  await Recipe.insertMany(SEEDS);
  console.log(`✅ Seeded ${SEEDS.length} sample recipes into MongoDB.`);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
