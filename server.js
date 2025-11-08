const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");  // ✅ Add this line

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB(process.env.MONGO_URI);

app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);  // ✅ Add this line too

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
