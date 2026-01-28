console.log("🔥🔥 STARTING GUARANTEED SERVER... 🔥🔥");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static('public')); 
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
mongoose.connect("mongodb+srv://siddarth:siddarth@cluster0.r3pfzhf.mongodb.net/vegetableShop")
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.log("❌ DB Error:", err));

// 2. DATA MODEL
const Vegetable = mongoose.model("Vegetable", new mongoose.Schema({
  name: String, price: Number, unit: String, category: String, inStock: Boolean, imageUrl: String
}));

// 3. MASTER LIST (Using Generated Placeholders)
// These images are created on-the-fly. They CANNOT break.
const masterList = [
    // VEGETABLES
    { name: "Tomato", price: 30, unit: "kg", category: "vegetable", inStock: true },
    { name: "Bangalore Tomato", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Onion", price: 30, unit: "kg", category: "vegetable", inStock: true },
    { name: "Potato", price: 25, unit: "kg", category: "vegetable", inStock: true },
    { name: "New Potato", price: 30, unit: "kg", category: "vegetable", inStock: true },
    { name: "Green Chillies", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Brinjal Black", price: 65, unit: "kg", category: "vegetable", inStock: true },
    { name: "Brinjal White", price: 65, unit: "kg", category: "vegetable", inStock: true },
    { name: "Brinjal Long", price: 65, unit: "kg", category: "vegetable", inStock: true },
    { name: "Lady Finger", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Bottle Gourd", price: 40, unit: "each", category: "vegetable", inStock: true },
    { name: "Ridge Gourd", price: 70, unit: "kg", category: "vegetable", inStock: true },
    { name: "Bitter Gourd", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Snake Gourd", price: 40, unit: "kg", category: "vegetable", inStock: true },
    { name: "Big Brinjal Black", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Cucumber (Keera)", price: 50, unit: "kg", category: "vegetable", inStock: true },
    { name: "Capsicum Green", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Radish", price: 10, unit: "each", category: "vegetable", inStock: true },
    { name: "Carrot", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Red Carrot", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Beetroot", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Cauliflower", price: 40, unit: "each", category: "vegetable", inStock: true },
    { name: "Cabbage", price: 40, unit: "kg", category: "vegetable", inStock: true },
    { name: "Sweet Potato", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Ginger", price: 160, unit: "kg", category: "vegetable", inStock: true },
    { name: "Garlic", price: 240, unit: "kg", category: "vegetable", inStock: true },
    { name: "Lemon", price: 5, unit: "each", category: "vegetable", inStock: true },
    { name: "Raw Banana", price: 15, unit: "each", category: "vegetable", inStock: true },
    { name: "Dondakaya (Ivy Gourd)", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Chamagadda (Colocasia)", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Dosakaya (Yellow Cucumber)", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Chikkudukaya (Indian Beans)", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Bajji Mirchi", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Raw Mango", price: 20, unit: "each", category: "vegetable", inStock: true },
    { name: "Goru Chikkudu (Cluster Beans)", price: 100, unit: "kg", category: "vegetable", inStock: true },
    { name: "Amla (Usirikaya)", price: 120, unit: "kg", category: "vegetable", inStock: true },
    { name: "Kandha gadda (Yam)", price: 80, unit: "kg", category: "vegetable", inStock: true },
    { name: "Curry Pumpkin", price: 60, unit: "kg", category: "vegetable", inStock: true },
    
    // OUT OF STOCK
    { name: "Parwal", price: 100, unit: "kg", category: "vegetable", inStock: false },
    { name: "Bora Beans", price: 60, unit: "kg", category: "vegetable", inStock: false },
    { name: "Big Brinjal White", price: 80, unit: "kg", category: "vegetable", inStock: false },
    { name: "Sponge Gourd", price: 80, unit: "kg", category: "vegetable", inStock: false },
    { name: "Curry Papaya", price: 50, unit: "kg", category: "vegetable", inStock: false },
    { name: "Broad Chikkudu", price: 80, unit: "kg", category: "vegetable", inStock: false },
    { name: "Drumstick", price: 15, unit: "each", category: "vegetable", inStock: false },

    // LEAFY
    { name: "Spinach (Palak)", price: 5, unit: "each", category: "leafy", inStock: true },
    { name: "Thota Kura (Amaranth)", price: 5, unit: "each", category: "leafy", inStock: true },
    { name: "Koithota kura", price: 5, unit: "bunch", category: "leafy", inStock: true },
    { name: "Coriander", price: 25, unit: "bunch", category: "leafy", inStock: true },
    { name: "Curry leaves", price: 5, unit: "each", category: "leafy", inStock: true },
    { name: "Mint (Pudeena)", price: 25, unit: "bunch", category: "leafy", inStock: true },
    { name: "Gongoora (Sorrel)", price: 15, unit: "bunch", category: "leafy", inStock: true },
    { name: "Menthi (Fenugreek)", price: 30, unit: "each", category: "leafy", inStock: true },
    { name: "Spring Onion", price: 10, unit: "bunch", category: "leafy", inStock: true },
    { name: "Munagaku (Drumstick Leaves)", price: 10, unit: "each", category: "leafy", inStock: true },
    { name: "Bacchala Kura", price: 15, unit: "bunch", category: "leafy", inStock: true },
    { name: "Mentham Small", price: 5, unit: "each", category: "leafy", inStock: true },
    { name: "Gangawali Kura", price: 5, unit: "each", category: "leafy", inStock: true },
    { name: "Mustard Leaf", price: 5, unit: "each", category: "leafy", inStock: false },
    { name: "Indian Sorrel (Chukka Kura)", price: 5, unit: "each", category: "leafy", inStock: false },
    { name: "Soykura", price: 10, unit: "each", category: "leafy", inStock: false },
    { name: "Ponagantikura", price: 15, unit: "bunch", category: "leafy", inStock: false },

    // OTHERS
    { name: "Betel Leaf", price: 2, unit: "each", category: "dairy", inStock: true },
    { name: "Paneer (Heritage)", price: 105, unit: "pack", category: "dairy", inStock: true },
    { name: "Mushroom", price: 60, unit: "pack", category: "dairy", inStock: true },
    { name: "Sweet Corn (Peeled)", price: 100, unit: "kg", category: "dairy", inStock: true },
    { name: "Baby Corn", price: 35, unit: "pack", category: "dairy", inStock: true },
    { name: "Eggs", price: 8, unit: "each", category: "dairy", inStock: true },
    { name: "Coconut", price: 45, unit: "each", category: "dairy", inStock: true },
    { name: "Peeled Garlic", price: 300, unit: "kg", category: "dairy", inStock: true },
    { name: "Green Peas (Hara Matar)", price: 80, unit: "kg", category: "dairy", inStock: true },
    { name: "Green Peas (Peeled)", price: 250, unit: "kg", category: "dairy", inStock: true },
    { name: "Raw Tamarind", price: 80, unit: "kg", category: "dairy", inStock: true },
    { name: "Raw Turmeric", price: 200, unit: "kg", category: "dairy", inStock: true },
    { name: "Raw Ground nut", price: 120, unit: "kg", category: "dairy", inStock: false },
    { name: "Chow Chow", price: 80, unit: "kg", category: "dairy", inStock: false },
    { name: "Red Mirchi", price: 120, unit: "kg", category: "dairy", inStock: false },
    { name: "Fresh Toor Dal", price: 120, unit: "kg", category: "dairy", inStock: false },

    // FRUITS & PREMIUM
    { name: "Papaya", price: 60, unit: "kg", category: "fruit", inStock: true },
    { name: "Watermelon", price: 50, unit: "kg", category: "fruit", inStock: true },
    { name: "Normal Banana", price: 60, unit: "dozen", category: "fruit", inStock: true },
    { name: "Small Banana", price: 80, unit: "dozen", category: "fruit", inStock: false },
    { name: "Apple", price: 30, unit: "each", category: "fruit", inStock: true },
    { name: "Pineapple", price: 50, unit: "each", category: "fruit", inStock: true },
    { name: "Broccoli", price: 250, unit: "kg", category: "premium", inStock: true },
    { name: "Capsicum Red", price: 250, unit: "kg", category: "premium", inStock: true },
    { name: "Capsicum Yellow", price: 250, unit: "kg", category: "premium", inStock: true },
    { name: "Zucchini", price: 160, unit: "kg", category: "premium", inStock: true },
    { name: "Lettuce Iceberg", price: 150, unit: "kg", category: "premium", inStock: true }
].map(item => ({
    ...item,
    // 🔥 AUTOMATIC IMAGE GENERATOR 🔥
    // Creates a green box with the item name written on it.
    imageUrl: `https://placehold.co/400x300/e8f5e9/1b5e20.png?text=${encodeURIComponent(item.name)}`
}));

// 4. API ROUTES
app.get("/api/vegetables", async (req, res) => {
  const vegetables = await Vegetable.find();
  res.json(vegetables);
});

app.patch("/api/vegetables/bulk-update", async (req, res) => {
  const updates = req.body; 
  const operations = updates.map((item) => ({
    updateOne: { filter: { _id: item._id }, update: { $set: item } }
  }));
  await Vegetable.bulkWrite(operations);
  res.json({ message: "Saved!" });
});

// 🔥 THE FIX BUTTON
app.post("/api/seed-products", async (req, res) => {
  try {
    console.log("⚠️ Wiping DB & Reloading Guaranteed Images...");
    await Vegetable.deleteMany({}); 
    await Vegetable.insertMany(masterList);
    console.log("✅ Done! 104 Items restored.");
    res.json({ message: "Fixed! All items restored with generated images." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. START
app.listen(3000, () => console.log("Server running at http://localhost:3000"));