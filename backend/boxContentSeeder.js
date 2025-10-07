import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import BoxContent from "./models/BoxContent.js";

dotenv.config();
connectDB();

const sampleBoxContents = [
  {
    productName: "iPhone 15 Pro Max",
    productDescription: "Latest iPhone with titanium design and advanced camera system",
    productImage: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    productPrice: 1199,
    currency: "USD",
    quantity: 1,
    purchaseType: "customer_purchase",
    orderId: "ORD-2024-003",
    warehouseLocation: "Main Warehouse",
    status: "inspected",
    inspection: {
      condition: "excellent",
      notes: "Item in perfect condition, original packaging intact",
      images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"]
    },
    customerActions: {
      requestedPacking: false,
      confirmedPacking: false,
      specialInstructions: "Please use extra padding for this expensive device"
    },
    fees: {
      handlingFee: 15.00,
      storageFee: 5.00,
      shippingFee: 25.00,
      totalFees: 45.00
    }
  },
  {
    productName: "Nike Air Jordan 1 Retro",
    productDescription: "Classic basketball shoes in Chicago colorway",
    productImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    productPrice: 170,
    currency: "USD",
    quantity: 1,
    purchaseType: "customer_purchase",
    orderId: "ORD-2024-001",
    warehouseLocation: "Main Warehouse",
    status: "ready_for_packing",
    inspection: {
      condition: "good",
      notes: "Shoes in good condition, minor scuff on box",
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"]
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      confirmedPacking: false,
      specialInstructions: "Please keep original box for resale value"
    },
    fees: {
      handlingFee: 10.00,
      storageFee: 3.00,
      shippingFee: 15.00,
      totalFees: 28.00
    }
  },
  {
    productName: "MacBook Pro 16-inch M3",
    productDescription: "Professional laptop with M3 chip and Liquid Retina XDR display",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    productPrice: 2499,
    currency: "USD",
    quantity: 1,
    purchaseType: "customer_purchase",
    orderId: "ORD-2024-004",
    warehouseLocation: "Main Warehouse",
    status: "packed",
    inspection: {
      condition: "excellent",
      notes: "Laptop in pristine condition, all accessories included",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"]
    },
    packing: {
      packedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      packageWeight: 2.1,
      packageDimensions: {
        length: 35.57,
        width: 24.81,
        height: 1.68
      },
      packagingMaterials: ["Bubble wrap", "Cardboard box", "Protective foam"],
      notes: "Securely packed with extra protection for screen"
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      specialInstructions: "Handle with extreme care - expensive laptop"
    },
    fees: {
      handlingFee: 25.00,
      storageFee: 8.00,
      shippingFee: 35.00,
      totalFees: 68.00
    }
  },
  {
    productName: "Sony WH-1000XM5 Headphones",
    productDescription: "Premium noise-canceling wireless headphones",
    productImage: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
    productPrice: 399,
    currency: "USD",
    quantity: 1,
    purchaseType: "customer_purchase",
    orderId: "ORD-2024-002",
    warehouseLocation: "Main Warehouse",
    status: "shipped",
    inspection: {
      condition: "excellent",
      notes: "Headphones in perfect condition, all accessories present",
      images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400"]
    },
    packing: {
      packedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      packageWeight: 0.8,
      packageDimensions: {
        length: 25.0,
        width: 20.0,
        height: 10.0
      },
      packagingMaterials: ["Original box", "Bubble wrap"],
      notes: "Packed in original Sony packaging"
    },
    shipping: {
      shippingMethod: "Express Shipping",
      shippingCost: 20.00,
      trackingNumber: "1Z999AA1234567890",
      shippedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      specialInstructions: "Standard shipping is fine"
    },
    fees: {
      handlingFee: 12.00,
      storageFee: 4.00,
      shippingFee: 20.00,
      totalFees: 36.00
    }
  },
  {
    productName: "Apple Watch Series 9",
    productDescription: "Latest Apple Watch with advanced health monitoring",
    productImage: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
    productPrice: 429,
    currency: "USD",
    quantity: 1,
    purchaseType: "customer_purchase",
    orderId: "ORD-2024-005",
    warehouseLocation: "Main Warehouse",
    status: "arrived",
    customerActions: {
      requestedPacking: false,
      confirmedPacking: false,
      specialInstructions: "Please ensure watch is protected from scratches"
    },
    fees: {
      handlingFee: 8.00,
      storageFee: 2.00,
      shippingFee: 12.00,
      totalFees: 22.00
    }
  }
];

const importBoxContents = async () => {
  try {
    // Find the test user
    const testUser = await User.findOne({ email: "test@example.com" });
    
    if (!testUser) {
      console.error("❌ Test user not found. Please run userSeeder.js first.");
      process.exit(1);
    }

    console.log(`✅ Found test user: ${testUser.name} (${testUser.email}) - Box #${testUser.boxNumber}`);

    // Clear existing box contents for this user
    await BoxContent.deleteMany({ user: testUser._id });
    console.log("🧹 Cleared existing box contents for test user");

    // Add user reference and box number to each item
    const boxContentsWithUser = sampleBoxContents.map(item => ({
      ...item,
      user: testUser._id,
      boxNumber: testUser.boxNumber,
      arrivalDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
    }));

    // Create box contents
    const createdBoxContents = await BoxContent.create(boxContentsWithUser);
    
    console.log("✅ Sample box contents created for test@example.com:");
    createdBoxContents.forEach((content, index) => {
      console.log(`${index + 1}. ${content.productName} - Status: ${content.status} - Value: $${content.productPrice}`);
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`- Total items: ${createdBoxContents.length}`);
    console.log(`- Total value: $${createdBoxContents.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0)}`);
    console.log(`- Buy Me items: ${createdBoxContents.filter(item => item.purchaseType === 'buy_me').length}`);
    console.log(`- Customer purchases: ${createdBoxContents.filter(item => item.purchaseType === 'customer_purchase').length}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating box contents:", err);
    process.exit(1);
  }
};

importBoxContents();
