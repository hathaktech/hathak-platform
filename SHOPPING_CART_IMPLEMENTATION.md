# Shopping Cart System Implementation

## Overview

This document describes the implementation of the dual shopping cart system for the HatHak platform, supporting both **Store** and **Buy for Me** services with complete separation.

## Architecture

### Backend Changes

#### 1. Cart Model Updates (`backend/models/Cart.js`)
- Added `serviceType` field to distinguish between 'store' and 'buyme' carts
- Added database indexes for better performance
- Maintains backward compatibility with existing cart functionality

#### 2. Cart Controller Updates (`backend/controllers/cartController.js`)
- Updated all cart operations to support service separation
- Modified session storage to use separate keys for each service type
- Enhanced cart retrieval, addition, removal, and checkout operations

#### 3. Database Schema
```javascript
{
  user: ObjectId,
  serviceType: 'store' | 'buyme', // NEW FIELD
  items: [cartItemSchema],
  totalPrice: Number,
  discount: Number,
  tax: Number
}
```

### Frontend Changes

#### 1. Buy for Me Cart (`frontend/src/app/User/ControlPanel/BuyForMe/cart/page.tsx`)
- **NEW PAGE**: Converted from saved products page to a proper shopping cart
- Drag-and-drop interface for moving products between saved and cart lists
- Integrated with existing BuyForMeCart API
- Full checkout flow with cost breakdown and shipping details
- Service fee calculations and promo code support

#### 2. Store Cart (`frontend/src/app/cart/page.tsx`)
- **EXISTING PAGE**: Enhanced to work with service separation
- Standard e-commerce cart functionality
- Product management and checkout flow

#### 3. Cart Context Updates (`frontend/src/context/CartContext.tsx`)
- Added service type parameter to cart operations
- Support for separate cart loading based on service type

#### 4. Cart Service Updates (`frontend/src/services/cartService.ts`)
- Enhanced API calls to include service type
- Updated local storage helpers for guest carts
- Separate storage keys for each service type

#### 5. Type Definitions (`frontend/src/types/cart.ts`)
- Added `serviceType` field to Cart interface
- Maintains type safety across the application

#### 6. Header Navigation (`frontend/src/components/Header.tsx`)
- **NEW FEATURE**: Cart dropdown with links to both cart types
- Easy access to Store Cart and Buy for Me Cart
- Visual indicators for cart item counts

## Key Features

### Buy for Me Cart
- **Product Management**: Add, edit, delete product requests
- **Drag & Drop**: Move products between saved and cart lists
- **Cost Calculation**: Automatic calculation of service fees, estimated fees, and custom fees
- **Checkout Flow**: Complete order submission with shipping details
- **Promo Codes**: Support for discount codes
- **Purchase Protection**: Integrated with HatHak's protection plan

### Store Cart
- **Standard E-commerce**: Traditional shopping cart functionality
- **Product Management**: Add, remove, update quantities
- **Checkout**: Standard order processing
- **Coupon Support**: Apply discount codes
- **Guest Support**: Works for both authenticated and guest users

### Service Separation
- **Complete Isolation**: Each service maintains its own cart data
- **Database Separation**: Different cart records for each service type
- **Session Separation**: Separate session storage for guest users
- **API Separation**: Service type parameter in all cart operations

## API Endpoints

### Cart Operations
- `GET /api/cart?serviceType=store|buyme` - Get cart for specific service
- `POST /api/cart/add` - Add item to cart (includes serviceType in body)
- `POST /api/cart/update` - Update cart item (includes serviceType in body)
- `POST /api/cart/remove` - Remove item from cart (includes serviceType in body)
- `POST /api/cart/checkout` - Checkout cart (includes serviceType in body)

### Buy for Me Operations
- Uses existing BuyForMeCart API endpoints
- Integrated with BuyMe request system
- Supports product submission for purchase

## Usage Examples

### Accessing Store Cart
```typescript
// Load store cart
const storeCart = await getCart('store');

// Add item to store cart
await addToCart({
  productId: 'product123',
  quantity: 2,
  serviceType: 'store'
});
```

### Accessing Buy for Me Cart
```typescript
// Load buy for me cart
const buymeCart = await getCart('buyme');

// Add item to buy for me cart
await addToCart({
  productId: 'product123',
  quantity: 1,
  serviceType: 'buyme'
});
```

### Navigation
- **Store Cart**: `/cart`
- **Buy for Me Cart**: `/User/ControlPanel/BuyForMe//cart`
- **Header Dropdown**: Access both carts from the main navigation

## Data Flow

### Store Cart Flow
1. User browses products in store
2. Adds items to store cart
3. Proceeds to checkout
4. Creates standard order

### Buy for Me Cart Flow
1. User adds product requests to saved list
2. Drags products to cart for purchase
3. Reviews cost breakdown with fees
4. Submits order for HatHak to purchase
5. Creates BuyMe request

## Benefits

1. **Service Separation**: Complete isolation between Store and Buy for Me services
2. **User Experience**: Intuitive drag-and-drop interface for Buy for Me
3. **Cost Transparency**: Clear breakdown of all fees and charges
4. **Scalability**: Easy to extend with additional service types
5. **Backward Compatibility**: Existing Store cart functionality preserved
6. **Type Safety**: Full TypeScript support throughout

## Testing

The implementation includes:
- Backend API testing for service separation
- Frontend component testing for cart functionality
- Integration testing for the complete flow
- Error handling and edge case coverage

## Future Enhancements

1. **Cart Persistence**: Enhanced guest cart persistence across sessions
2. **Cart Sharing**: Ability to share cart contents
3. **Wishlist Integration**: Connect with existing wishlist functionality
4. **Analytics**: Cart abandonment tracking and analytics
5. **Mobile Optimization**: Enhanced mobile experience for drag-and-drop
