import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo Connected"))
  .catch((err) => console.log(err));

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: String,
});

const Product = mongoose.model("Product", productSchema);

async function seedProducts() {
  const count = await Product.countDocuments();

  if (count > 0) return;

  const products = [
    { title: "Laptop", price: 55000, category: "electronics" },
    { title: "Mobile", price: 25000, category: "electronics" },
    { title: "Headphones", price: 3000, category: "electronics" },
    { title: "Smart Watch", price: 5000, category: "electronics" },
    { title: "Keyboard", price: 1500, category: "electronics" },

    { title: "T Shirt", price: 700, category: "fashion" },
    { title: "Jeans", price: 1200, category: "fashion" },
    { title: "Shoes", price: 3000, category: "fashion" },
    { title: "Jacket", price: 2500, category: "fashion" },
    { title: "Cap", price: 500, category: "fashion" },

    { title: "Rice", price: 100, category: "grocery" },
    { title: "Sugar", price: 60, category: "grocery" },
    { title: "Milk", price: 50, category: "grocery" },
    { title: "Oil", price: 150, category: "grocery" },
    { title: "Salt", price: 30, category: "grocery" },

    { title: "TV", price: 45000, category: "electronics" },
    { title: "Tablet", price: 18000, category: "electronics" },
    { title: "Shirt", price: 900, category: "fashion" },
    { title: "Pasta", price: 80, category: "grocery" },
    { title: "Mouse", price: 1000, category: "electronics" },
  ];

  await Product.insertMany(products);

  console.log("Seed Data Added");
}

mongoose.connection.once("open", seedProducts);

app.get("/products", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
    });

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});