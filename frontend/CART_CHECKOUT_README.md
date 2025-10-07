# Cart & Checkout System - HatHak Platform

## Overview

The Cart & Checkout system provides a complete e-commerce shopping experience with the following features:

- **Add to Cart**: Add products to cart from the products page
- **Cart Management**: View, update quantities, and remove items
- **Guest Cart**: Store cart in localStorage for non-authenticated users
- **Coupon System**: Apply discount codes to cart
- **Checkout Process**: Complete orders with payment method selection
- **Order Confirmation**: Success page with order details
- **Protected Routes**: Secure access to cart and checkout pages

## Architecture

### Frontend Structure

```
frontend/src/
├── types/
│   └── cart.ts                 # TypeScript interfaces for cart data
├── services/
│   └── cartService.ts          # API calls for cart operations
├── context/
│   └── CartContext.tsx         # Global cart state management
├── components/cart/
│   ├── CartItem.tsx            # Individual cart item component
│   ├── CartTotals.tsx          # Cart summary and totals
│   └── CouponForm.tsx          # Coupon code application
├── app/
│   ├── cart/
│   │   └── page.tsx            # Cart page
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── order-success/
│   │   └── page.tsx            # Order confirmation page
│   └── api/products/
│       └── route.ts            # Products API proxy
```

### Key Components

#### CartContext
- Manages global cart state
- Handles both authenticated and guest cart storage
- Syncs with backend for authenticated users
- Uses localStorage for guest users
- Merges guest cart with user cart on login

#### CartItem Component
- Displays individual cart items
- Quantity controls (increase/decrease)
- Remove item functionality
- Product image, name, price, and options display

#### CartTotals Component
- Shows cart summary (subtotal, discount, tax, total)
- Checkout button integration
- Responsive design for mobile and desktop

#### CouponForm Component
- Coupon code input and validation
- API integration for coupon application
- Success/error feedback

## Features

### 1. Add to Cart
- **Location**: Products page (`/HatHakStore`)
- **Functionality**: 
  - "Add to Cart" button on each product
  - Requires authentication
  - Shows loading state during API call
  - Toast notifications for success/error

### 2. Cart Page (`/cart`)
- **Protected Route**: Requires authentication
- **Features**:
  - Display all cart items with images and details
  - Quantity controls for each item
  - Remove item functionality
  - Coupon code application
  - Order summary with totals
  - Checkout button
  - Empty cart state with call-to-action

### 3. Checkout Process (`/checkout`)
- **Protected Route**: Requires authentication
- **Features**:
  - Customer information display (from user profile)
  - Payment method selection (COD, Bank Transfer)
  - Order notes input
  - Order summary
  - Place order functionality
  - Redirect to order confirmation

### 4. Order Success (`/order-success`)
- **Features**:
  - Order confirmation with details
  - Order ID and status display
  - Order items list
  - Next steps information
  - Navigation to dashboard or continue shopping

### 5. Guest Cart Support
- **Storage**: localStorage
- **Merge**: Automatically merges with user cart on login
- **Persistence**: Survives page refreshes and browser sessions

## API Integration

### Backend Endpoints Used
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `POST /api/cart/apply-coupon` - Apply coupon code
- `POST /api/cart/checkout` - Create order from cart
- `GET /api/orders/:id` - Get order details

### Error Handling
- Network errors with user-friendly messages
- Validation errors from backend
- Loading states for all async operations
- Toast notifications for user feedback

## State Management

### Cart State Structure
```typescript
interface Cart {
  items: CartItem[];
  totalPrice: number;
  discount: number;
  tax: number;
}
```

### Cart Actions
- `SET_CART` - Load cart from backend/localStorage
- `ADD_ITEM` - Add new item to cart
- `UPDATE_ITEM` - Update item quantity
- `REMOVE_ITEM` - Remove item from cart
- `CLEAR_CART` - Clear all items

## Security & Protection

### Protected Routes
- Cart page requires authentication
- Checkout page requires authentication
- Automatic redirect to login if not authenticated
- Toast notifications for access restrictions

### Data Validation
- Input validation for quantities
- Coupon code validation
- Payment method validation
- Order notes sanitization

## Responsive Design

### Mobile-First Approach
- Responsive grid layouts
- Touch-friendly buttons and controls
- Optimized spacing for mobile screens
- Collapsible sections for better mobile UX

### Desktop Enhancements
- Sidebar layout for cart summary
- Hover effects and transitions
- Larger click targets
- Enhanced visual hierarchy

## User Experience

### Loading States
- Skeleton loading for cart items
- Spinner for async operations
- Disabled buttons during processing
- Progress indicators for checkout

### Feedback
- Toast notifications for all actions
- Success/error messages
- Confirmation dialogs for destructive actions
- Clear call-to-action buttons

### Navigation
- Breadcrumb navigation
- Back buttons
- Continue shopping links
- Dashboard integration

## Testing Considerations

### Manual Testing Checklist
- [ ] Add items to cart as guest user
- [ ] Add items to cart as authenticated user
- [ ] Update item quantities
- [ ] Remove items from cart
- [ ] Apply coupon codes
- [ ] Complete checkout process
- [ ] View order confirmation
- [ ] Test responsive design
- [ ] Test error scenarios
- [ ] Test loading states

### Edge Cases
- Empty cart handling
- Invalid coupon codes
- Network errors
- Stock availability
- Payment method validation

## Future Enhancements

### Planned Features
- Save for later functionality
- Wishlist integration
- Multiple payment gateways
- Order tracking
- Email notifications
- Cart abandonment recovery
- Bulk operations
- Advanced filtering and sorting

### Technical Improvements
- Offline cart support
- Real-time stock updates
- Advanced caching strategies
- Performance optimizations
- A/B testing framework
- Analytics integration

## Dependencies

### Required Packages
- `lucide-react` - Icons
- `axios` - HTTP client
- `next/navigation` - Routing
- `react` - UI framework

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install lucide-react
   ```

2. **Set Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Test the Flow**
   - Navigate to `/HatHakStore`
   - Add items to cart
   - View cart at `/cart`
   - Proceed to checkout
   - Complete order

## Troubleshooting

### Common Issues
1. **Cart not loading**: Check backend API connectivity
2. **Authentication errors**: Verify token storage and API headers
3. **Coupon not applying**: Check coupon code validity and cart total
4. **Checkout failing**: Verify order data and payment method

### Debug Tips
- Check browser console for errors
- Verify API responses in Network tab
- Test with different user accounts
- Clear localStorage for fresh start
- Check backend logs for server errors
