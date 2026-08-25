console.log("🔥🔥 STARTING SRINIDHI VEGETABLES SERVER... 🔥🔥");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://siddarthdonthramoni_db_user:iJKVE8OMoIVDHX1B@cluster0.sjzkveh.mongodb.net/vegetableShop?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ DB Connection Failed:", err.message));

const Vegetable = mongoose.model("Vegetable", new mongoose.Schema({
  name: String, price: Number, unit: String, category: String, inStock: Boolean, imageUrl: String
}));

const User = mongoose.model("User", new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: String, address: String, email: String
}));

const Order = mongoose.model("Order", new mongoose.Schema({
  customerName: String, customerPhone: String, customerAddress: String, items: Array,
  totalAmount: Number, paymentMode: String, transactionId: String, status: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now }
}));

// --- VEGETABLE ROUTES ---
app.get("/api/vegetables", async (req, res) => {
    try { res.json(await Vegetable.find()); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/vegetables", async (req, res) => {
    try {
        const newItem = new Vegetable(req.body);
        await newItem.save();
        res.json({ message: "Item added successfully!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/vegetables/:id", async (req, res) => {
    try {
        await Vegetable.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Item updated successfully!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete("/api/vegetables/:id", async (req, res) => {
    try {
        await Vegetable.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- AUTH & ORDER ROUTES ---
app.post("/api/auth/login", async (req, res) => {
    try {
        const { phone, name, address, email } = req.body;
        if (!phone) return res.status(400).json({ error: "Phone required" });
        let user = await User.findOne({ phone });
        if (!user) { user = new User({ phone, name, address, email }); } 
        else { if (name) user.name = name; if (address) user.address = address; if (email) user.email = email; }
        await user.save();
        res.json({ message: "Login successful", user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ message: "Order placed!", orderId: order._id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/orders/my/:phone", async (req, res) => {
    try { res.json(await Order.find({ customerPhone: req.params.phone }).sort({ orderDate: -1 })); } 
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/admin/orders", async (req, res) => {
    try { res.json(await Order.find().sort({ orderDate: -1 })); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/admin/orders/:id/status", async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.json({ message: "Status updated!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));