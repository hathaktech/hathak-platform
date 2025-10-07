import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import BuyMe from "./models/BuyMe.js";
import BoxContent from "./models/BoxContent.js";

dotenv.config();
connectDB();

const sampleBuyMeRequests = [
  {
    productName: "Samsung Galaxy S24 Ultra",
    productLink: "https://www.samsung.com/us/smartphones/galaxy-s24-ultra/",
    productPrice: 1299,
    currency: "USD",
    quantity: 1,
    status: "delivered",
    notes: "Customer requested the latest Samsung flagship phone",
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    totalCost: 1299,
    serviceFee: 50,
    shippingCost: 25,
    finalTotal: 1374
  },
  {
    productName: "PlayStation 5 Console",
    productLink: "https://www.playstation.com/en-us/ps5/",
    productPrice: 499,
    currency: "USD",
    quantity: 1,
    status: "delivered",
    notes: "Gaming console for customer's son",
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    totalCost: 499,
    serviceFee: 30,
    shippingCost: 20,
    finalTotal: 549
  },
  {
    productName: "Dyson V15 Detect Vacuum",
    productLink: "https://www.dyson.com/vacuum-cleaners/cordless/v15-detect",
    productPrice: 749,
    currency: "USD",
    quantity: 1,
    status: "delivered",
    notes: "Premium vacuum cleaner for home",
    estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    totalCost: 749,
    serviceFee: 40,
    shippingCost: 30,
    finalTotal: 819
  }
];

const sampleBoxContents = [
  {
    productName: "Samsung Galaxy S24 Ultra",
    productDescription: "Latest Samsung flagship smartphone with AI-powered camera and S Pen",
    productImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    productPrice: 1299,
    currency: "USD",
    quantity: 1,
    purchaseType: "buy_me",
    warehouseLocation: "Main Warehouse",
    status: "inspected",
    inspection: {
      condition: "excellent",
      notes: "Phone in perfect condition, all accessories included, original packaging intact",
      images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"]
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      confirmedPacking: false,
      specialInstructions: "Please use extra protection for this expensive phone"
    },
    fees: {
      handlingFee: 20.00,
      storageFee: 5.00,
      shippingFee: 25.00,
      totalFees: 50.00
    }
  },
  {
    productName: "PlayStation 5 Console",
    productDescription: "Next-generation gaming console with ultra-high speed SSD",
    productImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
    productPrice: 499,
    currency: "USD",
    quantity: 1,
    purchaseType: "buy_me",
    warehouseLocation: "Main Warehouse",
    status: "packed",
    inspection: {
      condition: "excellent",
      notes: "Console in perfect condition, all cables and controller included",
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400"]
    },
    packing: {
      packedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      packageWeight: 4.5,
      packageDimensions: {
        length: 39.0,
        width: 26.0,
        height: 9.6
      },
      packagingMaterials: ["Original box", "Bubble wrap", "Protective foam"],
      notes: "Securely packed in original PlayStation packaging"
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      specialInstructions: "Handle with care - gaming console"
    },
    fees: {
      handlingFee: 15.00,
      storageFee: 4.00,
      shippingFee: 20.00,
      totalFees: 39.00
    }
  },
  {
    productName: "Dyson V15 Detect Vacuum",
    productDescription: "Cordless vacuum with laser dust detection and powerful suction",
    productImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
    productPrice: 749,
    currency: "USD",
    quantity: 1,
    purchaseType: "buy_me",
    warehouseLocation: "Main Warehouse",
    status: "shipped",
    inspection: {
      condition: "excellent",
      notes: "Vacuum in perfect condition, all attachments included",
      images: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"]
    },
    packing: {
      packedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      packageWeight: 3.2,
      packageDimensions: {
        length: 25.0,
        width: 20.0,
        height: 15.0
      },
      packagingMaterials: ["Original box", "Bubble wrap"],
      notes: "Packed in original Dyson packaging with all accessories"
    },
    shipping: {
      shippingMethod: "Standard Shipping",
      shippingCost: 30.00,
      trackingNumber: "1Z999BB2345678901",
      shippedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      specialInstructions: "Standard shipping is fine"
    },
    fees: {
      handlingFee: 18.00,
      storageFee: 6.00,
      shippingFee: 30.00,
      totalFees: 54.00
    }
  }
];

const importBuyMeBoxContents = async () => {
  try {
    // Find the test user
    const testUser = await User.findOne({ email: "test@example.com" });
    
    if (!testUser) {
      console.error("❌ Test user not found. Please run userSeeder.js first.");
      process.exit(1);
    }

    console.log(`✅ Found test user: ${testUser.name} (${testUser.email}) - Box #${testUser.boxNumber}`);

    // Clear existing BuyMe requests and box contents for this user
    await BuyMe.deleteMany({ userId: testUser._id });
    await BoxContent.deleteMany({ user: testUser._id });
    console.log("🧹 Cleared existing BuyMe requests and box contents for test user");

    // Create BuyMe requests first
    const buyMeRequestsWithUser = sampleBuyMeRequests.map(request => ({
      ...request,
      userId: testUser._id
    }));

    const createdBuyMeRequests = await BuyMe.create(buyMeRequestsWithUser);
    console.log("✅ Created BuyMe requests:");
    createdBuyMeRequests.forEach((request, index) => {
      console.log(`${index + 1}. ${request.productName} - $${request.productPrice}`);
    });

    // Create box contents linked to BuyMe requests
    const boxContentsWithUser = sampleBoxContents.map((content, index) => ({
      ...content,
      user: testUser._id,
      boxNumber: testUser.boxNumber,
      buyMeRequest: createdBuyMeRequests[index]._id,
      arrivalDate: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) // Random date within last 5 days
    }));

    const createdBoxContents = await BoxContent.create(boxContentsWithUser);
    
    console.log("\n✅ Sample box contents created for test@example.com:");
    createdBoxContents.forEach((content, index) => {
      console.log(`${index + 1}. ${content.productName} - Status: ${content.status} - Value: $${content.productPrice} - Type: ${content.purchaseType}`);
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`- Total BuyMe requests: ${createdBuyMeRequests.length}`);
    console.log(`- Total box contents: ${createdBoxContents.length}`);
    console.log(`- Total value: $${createdBoxContents.reduce((sum, item) => sum + (item.productPrice * item.quantity), 0)}`);
    console.log(`- Buy Me items: ${createdBoxContents.filter(item => item.purchaseType === 'buy_me').length}`);
    console.log(`- Customer purchases: ${createdBoxContents.filter(item => item.purchaseType === 'customer_purchase').length}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating BuyMe box contents:", err);
    process.exit(1);
  }
};

importBuyMeBoxContents();
