#!/bin/bash
# Hathak Platform - Replit Quick Start Script

echo "🚀 Starting Hathak Platform in Replit..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:replit

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Trying alternative method..."
    npm install
    cd backend && npm install
    cd ../frontend && npm install
    cd ..
fi

echo ""
echo "🔧 Starting development servers..."
echo "📱 Frontend will be available at the main Replit URL"
echo "🔧 Backend API will be available at /api"
echo ""

# Start development servers
npm run dev:replit
