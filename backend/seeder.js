import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: "HatHak T-Shirt",
    description: "Premium cotton t-shirt with HatHak logo",
    price: 25,
    stock: 10,
    image: "https://via.placeholder.com/300x200?text=HatHak+T-Shirt",
    orderLink: "/order/tshirt",
    createdBy: "64f000000000000000000000", // <-- use a valid user ObjectId or any string for now
  },
  {
    name: "HatHak Hoodie",
    description: "Warm hoodie for all seasons",
    price: 50,
    stock: 5,
    image: "https://via.placeholder.com/300x200?text=HatHak+Hoodie",
    orderLink: "/order/hoodie",
    createdBy: "64f000000000000000000000",
  },
  {
    name: "HatHak Cap",
    description: "Stylish cap with adjustable strap",
    price: 15,
    stock: 20,
    image: "https://via.placeholder.com/300x200?text=HatHak+Cap",
    orderLink: "/order/cap",
    createdBy: "64f000000000000000000000",
  },
];


const importData = async () => {
  try {
    await Product.deleteMany(); // Remove existing products
    await Product.insertMany(sampleProducts);
    console.log("✅ Sample products added");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
