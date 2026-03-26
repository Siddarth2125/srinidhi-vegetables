console.log("🔥🔥 STARTING E-COMMERCE SERVER... 🔥🔥");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://siddarth:siddarth@cluster0.r3pfzhf.mongodb.net/vegetableShop";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ DB Connection Failed:", err.message));

// ===== MODELS =====
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
  status: { type: String, default: 'Pending' },
  orderDate: { type: Date, default: Date.now }
}));

// ===== REAL IMAGES =====
const realImages = {
    "tomato": "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    "bangalore tomato": "https://m.media-amazon.com/images/I/71jG9IBb+rL._SX679_.jpg",
    "onion": "https://upload.wikimedia.org/wikipedia/commons/2/25/Onion_on_White.JPG",
    "potato": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Patates.jpg",
    "new potato": "https://m.media-amazon.com/images/I/61ntetAizEL._SX679_.jpg",
    "green chillies": "https://www.bbassets.com/media/uploads/p/l/50000511_10-fresho-chilli-green-organically-grown.jpg",
    "brinjal black": "https://m.media-amazon.com/images/I/41s-VZbumXL.jpg",
    "brinjal white": "https://m.media-amazon.com/images/I/51cIoaCCf6L._SX679_.jpg",
    "brinjal long": "https://m.media-amazon.com/images/I/61JUFWKdliL._SX679_.jpg",
    "lady finger": "https://m.media-amazon.com/images/I/31qgGAmYXKL._SX300_SY300_QL70_FMwebp_.jpg",
    "bottle gourd": "https://m.media-amazon.com/images/I/51155xEWpGL.jpg",
    "ridge gourd": "https://m.media-amazon.com/images/I/61-pNFV+KSL._SX679_.jpg",
    "bitter gourd": "https://www.bbassets.com/media/uploads/p/l/20000729_16-fresho-bitter-gourd-forest.jpg",
    "snake gourd": "https://m.media-amazon.com/images/I/51cGCpGOmVL.jpg",
    "cucumber (keera)": "https://m.media-amazon.com/images/I/71xkI-PIE5L._SX679_PIbundle-2,TopRight,0,0_SX679SY493SH20_.jpg",
    "capsicum green": "https://m.media-amazon.com/images/I/71UbN9-gk8L._SX679_.jpg",
    "capsicum red": "https://m.media-amazon.com/images/I/31kA4Qy7q0S._SY300_SX300_QL70_FMwebp_.jpg",
    "capsicum yellow": "https://m.media-amazon.com/images/I/61LtOXKHvuL._SX679_.jpg",
    "radish": "https://m.media-amazon.com/images/I/517LlhycGUL.jpg",
    "carrot": "https://www.bbassets.com/media/uploads/p/l/40022634_7-fresho-carrot-organically-grown.jpg",
    "red carrot": "https://m.media-amazon.com/images/I/613sCMxt3tL._SX679_.jpg",
    "beetroot": "https://m.media-amazon.com/images/I/71XsyPm+xZL.jpg",
    "cauliflower": "https://m.media-amazon.com/images/I/91EdPVzD99L._AC_UF1000,1000_QL80_.jpg",
    "cabbage": "https://m.media-amazon.com/images/I/61cs7sVQCJL._AC_UF350,350_QL80_.jpg",
    "sweet potato": "https://m.media-amazon.com/images/I/81M2Cj2BA1L.jpg",
    "ginger": "https://m.media-amazon.com/images/I/61hin4-KL1L._AC_UF894,1000_QL80_.jpg",
    "garlic": "https://m.media-amazon.com/images/I/71KmgOL2q4L.jpg",
    "lemon": "https://m.media-amazon.com/images/I/61wl85nUOUL._AC_UF894,1000_QL80_.jpg",
    "raw banana": "https://m.media-amazon.com/images/I/61K7bhNJsgL.jpg",
    "dondakaya (ivy gourd)": "https://freshfarmse.com/wp-content/uploads/2025/04/Ivy-Gourd-PNG-HD-Quality.png",
    "drumstick": "https://5.imimg.com/data5/EQ/LA/JW/SELLER-52718678/green-drumstick-500x500.jpg",
    "spinach (palak)": "https://m.media-amazon.com/images/I/51T3025eGcL._AC_UF894,1000_QL80_.jpg",
    "coriander": "https://m.media-amazon.com/images/I/71pbtRs3UQL._AC_UF894,1000_QL80_.jpg",
    "curry leaves": "https://m.media-amazon.com/images/I/71KHkFkPO+L._AC_UF894,1000_QL80_.jpg",
    "mint (pudeena)": "https://m.media-amazon.com/images/I/61CSxdsG8wL._AC_UF1000,1000_QL80_.jpg",
    "sweet corn (peeled)": "https://5.imimg.com/data5/SELLER/Default/2021/9/WU/RD/FB/136741020/peeled-sweet-corn.jpg",
    "baby corn": "https://m.media-amazon.com/images/I/51zVFCwztXL.jpg",
    "eggs": "https://m.media-amazon.com/images/I/712Bjx8MJKL._AC_UF894,1000_QL80_.jpg",
    "coconut": "https://m.media-amazon.com/images/I/61THuQWrAZL._AC_UF894,1000_QL80_.jpg",
    "peeled garlic": "https://m.media-amazon.com/images/I/617cdTizHdL.jpg",
    "green peas (hara matar)": "https://m.media-amazon.com/images/I/612O377T9FL._SX679_.jpg",
    "papaya": "https://m.media-amazon.com/images/I/61CuiyI4aBL._SX679_.jpg",
    "watermelon": "https://m.media-amazon.com/images/I/61r5l3+Ml7L.jpg",
    "normal banana": "https://m.media-amazon.com/images/I/51ebZJ+DR4L._AC_UF894,1000_QL80_.jpg",
    "apple": "https://www.bbassets.com/media/uploads/p/l/40319252_3-fresho-apple-red-delicious.jpg",
    "pineapple": "https://m.media-amazon.com/images/I/81XA2GQIPOL.jpg",
    "broccoli": "https://m.media-amazon.com/images/I/61lxGX909uL._AC_UF894,1000_QL80_.jpg",
    "zucchini": "https://www.bbassets.com/media/uploads/p/l/10000211_17-fresho-zucchini-yellow.jpg",
    "lettuce iceberg": "https://www.bbassets.com/media/uploads/p/l/10000132_18-fresho-lettuce-iceberg.jpg",
    "mushroom": "https://5.imimg.com/data5/ANDROID/Default/2021/7/EC/NL/ZO/64531483/prod-20210713-1651572948365688504507811-jpg.jpg"
};

// ===== MASTER PRODUCT LIST =====
const masterList = [
    // VEGETABLES
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
    { name: "Parwal", price: 100, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Bora Beans", price: 60, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Big Brinjal White", price: 80, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Sponge Gourd", price: 80, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Curry Papaya", price: 50, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Broad Chikkudu", price: 80, unit: "kg", category: "Vegetable", inStock: false },
    { name: "Drumstick", price: 15, unit: "each", category: "Vegetable", inStock: false },
    // LEAFY
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
    { name: "Mustard Leaf", price: 5, unit: "each", category: "Leafy", inStock: false },
    { name: "Indian Sorrel (Chukka Kura)", price: 5, unit: "each", category: "Leafy", inStock: false },
    { name: "Soykura", price: 10, unit: "each", category: "Leafy", inStock: false },
    { name: "Ponagantikura", price: 15, unit: "bunch", category: "Leafy", inStock: false },
    // PREMIUM
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
    { name: "Raw Ground nut", price: 120, unit: "kg", category: "Premium", inStock: false },
    { name: "Chow Chow", price: 80, unit: "kg", category: "Premium", inStock: false },
    { name: "Red Mirchi", price: 120, unit: "kg", category: "Premium", inStock: false },
    { name: "Fresh Toor Dal", price: 120, unit: "kg", category: "Premium", inStock: false },
    { name: "Broccoli", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Capsicum Red", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Capsicum Yellow", price: 250, unit: "kg", category: "Premium", inStock: true },
    { name: "Zucchini", price: 160, unit: "kg", category: "Premium", inStock: true },
    { name: "Lettuce Iceberg", price: 150, unit: "kg", category: "Premium", inStock: true },
    // FRUITS
    { name: "Papaya", price: 60, unit: "kg", category: "Fruit", inStock: true },
    { name: "Watermelon", price: 50, unit: "kg", category: "Fruit", inStock: true },
    { name: "Normal Banana", price: 60, unit: "dozen", category: "Fruit", inStock: true },
    { name: "Small Banana", price: 80, unit: "dozen", category: "Fruit", inStock: false },
    { name: "Apple", price: 30, unit: "each", category: "Fruit", inStock: true },
    { name: "Pineapple", price: 50, unit: "each", category: "Fruit", inStock: true },
].map(item => ({
    ...item,
    // This injects the real image directly into the database!
    imageUrl: realImages[item.name.toLowerCase()] || `https://placehold.co/400x300/e8f5e9/1b5e20.png?text=${encodeURIComponent(item.name)}`
}));

// ===== ROUTES: VEGETABLES =====
app.get("/api/vegetables", async (req, res) => {
    try { res.json(await Vegetable.find()); }
    catch (e) { res.status(500).json({ error: e.message }); }
});

app.patch("/api/vegetables/bulk-update", async (req, res) => {
    try {
        const ops = req.body.map(item => ({
            updateOne: { filter: { _id: item._id }, update: { $set: item } }
        }));
        await Vegetable.bulkWrite(ops);
        res.json({ message: "Saved!" });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post("/api/seed-products", async (req, res) => {
    try {
        await Vegetable.deleteMany({});
        await Vegetable.insertMany(masterList);
        res.json({ message: `Database seeded with ${masterList.length} products!` });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== ROUTES: AUTH =====
app.post("/api/auth/login", async (req, res) => {
    try {
        const { phone, name, address } = req.body;
        if (!phone) return res.status(400).json({ error: "Phone required" });
        let user = await User.findOne({ phone });
        if (!user) {
            user = new User({ phone, name, address });
        } else {
            if (name) user.name = name;
            if (address) user.address = address;
        }
        await user.save();
        res.json({ message: "Login successful", user });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===== ROUTES: ORDERS =====
app.post("/api/orders", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ message: "Order placed!", orderId: order._id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get("/api/orders/my/:phone", async (req, res) => {
    try {
        res.json(await Order.find({ customerPhone: req.params.phone }).sort({ orderDate: -1 }));
    } catch (e) { res.status(500).json({ error: e.message }); }
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

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));