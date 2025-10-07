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
    estimatedPrice: 1299,
    currency: "USD",
    quantity: 1,
    status: "delivered",
    notes: "Customer requested the latest Samsung flagship phone",
    deliveryCountry: "USA",
    shippingMethod: "Express"
  },
  {
    productName: "PlayStation 5 Console",
    productLink: "https://www.playstation.com/en-us/ps5/",
    estimatedPrice: 499,
    currency: "USD",
    quantity: 1,
    status: "delivered",
    notes: "Gaming console for customer's son",
    deliveryCountry: "USA",
    shippingMethod: "Standard"
  },
  {
    productName: "Dyson V15 Detect Vacuum",
    productLink: "https://www.dyson.com/vacuum-cleaners/cordless/v15-detect",
    estimatedPrice: 749,
    currency: "USD",
    quantity: 1,
    status: "delivered",
    notes: "Premium vacuum cleaner for home",
    deliveryCountry: "USA",
    shippingMethod: "Standard"
  }
];

const sampleBoxContents = [
  // Buy Me Service Items
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
      packingRequestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
      packedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
      packingRequestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
      packedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
      shippedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      specialInstructions: "Standard shipping is fine"
    },
    fees: {
      handlingFee: 18.00,
      storageFee: 6.00,
      shippingFee: 30.00,
      totalFees: 54.00
    }
  },
  // Customer Purchase Items
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
      packingRequestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
      packedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
      packingRequestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
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
      packedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
      shippedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    customerActions: {
      requestedPacking: true,
      packingRequestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      confirmedPacking: true,
      confirmationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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

const importCompleteBoxContents = async () => {
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

    // Create BuyMe requests first (only for buy_me items)
    const buyMeRequestsWithUser = sampleBuyMeRequests.map(request => ({
      ...request,
      userId: testUser._id
    }));

    const createdBuyMeRequests = await BuyMe.create(buyMeRequestsWithUser);
    console.log("✅ Created BuyMe requests:");
    createdBuyMeRequests.forEach((request, index) => {
      console.log(`${index + 1}. ${request.productName} - $${request.estimatedPrice}`);
    });

    // Create box contents
    const boxContentsWithUser = sampleBoxContents.map((content, index) => {
      const boxContent = {
        ...content,
        user: testUser._id,
        boxNumber: testUser.boxNumber,
        arrivalDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last week
      };

      // Link to BuyMe request if it's a buy_me purchase
      if (content.purchaseType === 'buy_me') {
        const buyMeIndex = sampleBoxContents.slice(0, index + 1).filter(item => item.purchaseType === 'buy_me').length - 1;
        boxContent.buyMeRequest = createdBuyMeRequests[buyMeIndex]._id;
      }

      return boxContent;
    });

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
    console.error("❌ Error creating complete box contents:", err);
    process.exit(1);
  }
};

importCompleteBoxContents();
