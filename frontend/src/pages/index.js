import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Allows the frontend (port 5173) to talk to backend (port 5000)

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/biterite')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  time: String,
  calories: String,
  ingredients: [String],
  instructions: [String],
  createdAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Routes
app.post('/api/recipes', async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
