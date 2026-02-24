console.log("🔥🔥 STARTING E-COMMERCE SERVER (FULL LIST)... 🔥🔥");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static('public')); 
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION
const MONGO_URI = "mongodb+srv://siddarth:siddarth@cluster0.r3pfzhf.mongodb.net/vegetableShop";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ DB Connection Failed:", err.message));

// 2. DATA MODELS
const Vegetable = mongoose.model("Vegetable", new mongoose.Schema({
  name: String, price: Number, unit: String, category: String, inStock: Boolean, imageUrl: String
}));

const User = mongoose.model("User", new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String,
  address: String
}));

const Order = mongoose.model("Order", new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  items: Array, 
  totalAmount: Number,
  paymentMode: String,
  status: { type: String, default: 'Pending' }, // Pending, Packed, Delivered
  orderDate: { type: Date, default: Date.now }
}));

// 3. MASTER LIST (Full list restored for Database Reset)
const masterList = [
    // --- VEGETABLES ---
    { name: "Tomato", price: 50, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Bangalore Tomato", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Onion", price: 30, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Potato", price: 25, unit: "kg", category: "Vegetable", inStock: true },
    { name: "New Potato", price: 30, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Green Chillies", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Brinjal Black", price: 65, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Brinjal White", price: 65, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Brinjal Long", price: 65, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Lady Finger", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Bottle Gourd", price: 40, unit: "each", category: "Vegetable", inStock: true },
    { name: "Ridge Gourd", price: 70, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Bitter Gourd", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Snake Gourd", price: 40, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Big Brinjal Black", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Cucumber (Keera)", price: 50, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Capsicum Green", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Radish", price: 10, unit: "each", category: "Vegetable", inStock: true },
    { name: "Carrot", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Red Carrot", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Beetroot", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Cauliflower", price: 40, unit: "each", category: "Vegetable", inStock: true },
    { name: "Cabbage", price: 40, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Sweet Potato", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Ginger", price: 160, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Garlic", price: 240, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Lemon", price: 5, unit: "each", category: "Vegetable", inStock: true },
    { name: "Raw Banana", price: 15, unit: "each", category: "Vegetable", inStock: true },
    { name: "Dondakaya (Ivy Gourd)", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Chamagadda (Colocasia)", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Dosakaya (Yellow Cucumber)", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Chikkudukaya (Indian Beans)", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Bajji Mirchi", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Raw Mango", price: 20, unit: "each", category: "Vegetable", inStock: true },
    { name: "Goru Chikkudu (Cluster Beans)", price: 100, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Amla (Usirikaya)", price: 120, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Kandha gadda (Yam)", price: 80, unit: "kg", category: "Vegetable", inStock: true },
    { name: "Curry Pumpkin", price: 60, unit: "kg", category: "Vegetable", inStock: true },
    
    // --- OUT OF STOCK VEG ---
    { name: "Parwal", price: 100, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Bora Beans", price: 60, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Big Brinjal White", price: 80, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Sponge Gourd", price: 80, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Curry Papaya", price: 50, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Broad Chikkudu", price: 80, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Drumstick", price: 15, unit: "each", category: "Vegetable", inStock: false },

    // --- LEAFY VEGETABLES ---
    { name: "Spinach (Palak)", price: 5, unit: "each", category: "Leafy", inStock: true },
    { name: "Thota Kura (Amaranth)", price: 5, unit: "each", category: "Leafy", inStock: true },
    { name: "Koithota kura", price: 5, unit: "bunch", category: "Leafy", inStock: true },
    { name: "Coriander", price: 25, unit: "bunch", category: "Leafy", inStock: true },
    { name: "Curry leaves", price: 5, unit: "each", category: "Leafy", inStock: true },
    { name: "Mint (Pudeena)", price: 25, unit: "bunch", category: "Leafy", inStock: true },
    { name: "Gongoora (Sorrel)", price: 15, unit: "bunch", category: "Leafy", inStock: true },
    { name: "Menthi (Fenugreek)", price: 30, unit: "each", category: "Leafy", inStock: true },
    { name: "Spring Onion", price: 10, unit: "bunch", category: "Leafy", inStock: true },
    { name: "Munagaku (Drumstick Leaves)", price: 10, unit: "each", category: "Leafy", inStock: true },
    { name: "Bacchala Kura", price: 15, unit: "bunch", category: "Leafy", inStock: true },
    { name: "Mentham Small", price: 5, unit: "each", category: "Leafy", inStock: true },
    { name: "Gangawali Kura", price: 5, unit: "each", category: "Leafy", inStock: true },
    
    // --- OUT OF STOCK LEAFY ---
    { name: "Mustard Leaf", price: 5, unit: "each", category: "Leafy", inStock: false },
    { name: "Indian Sorrel (Chukka Kura)", price: 5, unit: "each", category: "Leafy", inStock: false },
    { name: "Soykura", price: 10, unit: "each", category: "Leafy", inStock: false },
    { name: "Ponagantikura", price: 15, unit: "bunch", category: "Leafy", inStock: false },

    // --- DAIRY & OTHERS (Categorized as Premium) ---
    { name: "Betel Leaf", price: 2, unit: "each", category: "Premium", inStock: true },
    { name: "Paneer (Heritage)", price: 105, unit: "pack", category: "Premium", inStock: true },
    { name: "Mushroom", price: 60, unit: "pack", category: "Premium", inStock: true },
    { name: "Sweet Corn (Peeled)", price: 100, unit: "kg", category: "Premium", inStock: true },
    { name: "Baby Corn", price: 35, unit: "pack", category: "Premium", inStock: true },
    { name: "Eggs", price: 8, unit: "each", category: "Premium", inStock: true },
    { name: "Coconut", price: 45, unit: "each", category: "Premium", inStock: true },
    { name: "Peeled Garlic", price: 300, unit: "kg", category: "Premium", inStock: true },
    { name: "Green Peas (Hara Matar)", price: 80, unit: "kg", category: "Premium", inStock: true },
    { name: "Green Peas (Peeled)", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Raw Tamarind", price: 80, unit: "kg", category: "Premium", inStock: true },
    { name: "Raw Turmeric", price: 200, unit: "kg", category: "Premium", inStock: true },

    // --- OUT OF STOCK OTHERS ---
    { name: "Raw Ground nut", price: 120, unit: "kg", category: "Premium", inStock: false },
    { name: "Chow Chow", price: 80, unit: "kg", category: "Premium", inStock: false },
    { name: "Red Mirchi", price: 120, unit: "kg", category: "Premium", inStock: false },
    { name: "Fresh Toor Dal", price: 120, unit: "kg", category: "Premium", inStock: false },

    // --- FRUITS ---
    { name: "Papaya", price: 60, unit: "kg", category: "Fruit", inStock: true },
    { name: "Watermelon", price: 50, unit: "kg", category: "Fruit", inStock: true },
    { name: "Normal Banana", price: 60, unit: "dozen", category: "Fruit", inStock: true },
    { name: "Small Banana", price: 80, unit: "dozen", category: "Fruit", inStock: false },
    { name: "Apple", price: 30, unit: "each", category: "Fruit", inStock: true },
    { name: "Pineapple", price: 50, unit: "each", category: "Fruit", inStock: true },

    // --- PREMIUM ---
    { name: "Broccoli", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Capsicum Red", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Capsicum Yellow", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Zucchini", price: 160, unit: "kg", category: "Premium", inStock: true },
    { name: "Lettuce Iceberg", price: 150, unit: "kg", category: "Premium", inStock: true }
].map(item => ({
    ...item,
    imageUrl: `https://placehold.co/400x300/e8f5e9/1b5e20.png?text=${encodeURIComponent(item.name)}`
}));

// ==========================================
// 4. API ROUTES: VEGETABLES
// ==========================================
app.get("/api/vegetables", async (req, res) => {
  try {
    const vegetables = await Vegetable.find();
    res.json(vegetables);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

app.patch("/api/vegetables/bulk-update", async (req, res) => {
  try {
    const updates = req.body; 
    const operations = updates.map((item) => ({ updateOne: { filter: { _id: item._id }, update: { $set: item } } }));
    await Vegetable.bulkWrite(operations);
    res.json({ message: "Saved!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/seed-products", async (req, res) => {
  try {
    await Vegetable.deleteMany({}); 
    await Vegetable.insertMany(masterList);
    res.json({ message: "Database fixed! All items are now present." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 5. API ROUTES: USERS & LOGIN
// ==========================================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { phone, name, address } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone is required" });

    // Find user or create new one
    let user = await User.findOne({ phone: phone });
    if (!user) {
      user = new User({ phone, name, address });
    } else {
      // Update name/address if they changed it
      if (name) user.name = name;
      if (address) user.address = address;
    }
    await user.save();
    res.json({ message: "Login successful", user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 6. API ROUTES: ORDERS
// ==========================================
// Customer places a new order
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, customerPhone, customerAddress, items, totalAmount, paymentMode } = req.body;
    
    const newOrder = new Order({
      customerName, customerPhone, customerAddress, items, totalAmount, paymentMode
    });
    
    await newOrder.save();
    res.json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Customer checks their own orders
app.get("/api/orders/my/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ customerPhone: req.params.phone }).sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin views ALL orders
app.get("/api/admin/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin updates order status (Pending -> Packed -> Delivered)
app.patch("/api/admin/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status: status });
    res.json({ message: "Order status updated!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 7. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});