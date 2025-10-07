# HatHak Authentication System

This document describes the complete authentication system implemented for the HatHak platform using Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **JWT-based Authentication** - Secure token-based authentication
- **User Registration & Login** - Complete user account management
- **Protected Routes** - Route protection with role-based access control
- **Form Validation** - Client-side and server-side validation
- **Error Handling** - Comprehensive error handling and user feedback
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **TypeScript Support** - Full type safety throughout the system

## 📁 File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   ├── register/page.tsx       # Registration page
│   │   └── forgot-password/page.tsx # Password reset page
│   ├── dashboard/page.tsx          # Protected dashboard
│   └── unauthorized/page.tsx       # Access denied page
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx          # Login form component
│   │   ├── RegisterForm.tsx       # Registration form component
│   │   ├── ForgotPasswordForm.tsx # Password reset form
│   │   └── ProtectedRoute.tsx     # Route protection component
│   └── dashboard/
│       └── DashboardContent.tsx    # Dashboard content
├── context/
│   └── AuthContext.tsx            # Authentication context
├── services/
│   └── authService.ts             # API service layer
├── types/
│   └── auth.ts                    # TypeScript interfaces
└── utils/
    └── auth.ts                    # Utility functions
```

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the frontend directory:

```bash
# Copy the example file
cp env.example .env.local

# Edit the file with your configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001
NODE_ENV=development
```

### 2. Backend Requirements

Ensure your Express backend has the following endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### 3. Start the Application

```bash
# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

## 🔐 Authentication Flow

### 1. User Registration
1. User fills out registration form
2. Form validation (client-side)
3. API call to backend
4. JWT token received and stored
5. User redirected to dashboard

### 2. User Login
1. User enters credentials
2. Form validation
3. API authentication
4. Token storage in localStorage
5. User session established

### 3. Protected Routes
1. Route component wrapped with `ProtectedRoute`
2. Authentication status checked
3. Unauthorized users redirected to login
4. Admin routes check user role

## 🎯 Usage Examples

### Protecting a Route

```tsx
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### Using Authentication Context

```tsx
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls

```tsx
import { authService } from '@/services/authService';

// The service automatically includes the auth token
const user = await authService.getCurrentUser();
```

## 🔒 Security Features

- **JWT Token Storage** - Secure localStorage usage
- **Automatic Token Refresh** - Handled by interceptors
- **CSRF Protection** - Utility functions for token generation
- **Input Sanitization** - XSS prevention
- **Role-based Access Control** - Admin/user permissions
- **Secure Password Validation** - Strong password requirements

## 🎨 Styling

The system uses Tailwind CSS for consistent, responsive design:

- **Color Scheme** - Indigo primary, gray neutrals
- **Responsive Design** - Mobile-first approach
- **Interactive States** - Hover, focus, and disabled states
- **Loading States** - Spinners and disabled buttons
- **Error States** - Red borders and error messages

## 🚨 Error Handling

- **Form Validation** - Real-time client-side validation
- **API Errors** - Structured error handling
- **Network Issues** - Graceful fallbacks
- **User Feedback** - Clear error messages

## 📱 Responsive Design

- **Mobile First** - Optimized for small screens
- **Tablet Support** - Medium screen layouts
- **Desktop** - Full-featured desktop experience
- **Touch Friendly** - Proper touch targets

## 🔧 Customization

### Changing Colors

Update the Tailwind classes in components:

```tsx
// Change from indigo to blue
className="bg-blue-600 hover:bg-blue-700"
```

### Adding New Fields

Extend the types in `types/auth.ts`:

```tsx
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string; // New optional field
}
```

### Modifying Validation

Update validation logic in form components:

```tsx
const validateForm = (): boolean => {
  const errors: Partial<RegisterFormData> = {};
  
  // Add custom validation
  if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
    errors.phone = 'Phone must be 10 digits';
  }
  
  // ... rest of validation
};
```

## 🧪 Testing

The authentication system is designed to be easily testable:

- **Component Testing** - Isolated component testing
- **Context Testing** - Mock authentication context
- **Service Testing** - Mock API responses
- **Integration Testing** - End-to-end authentication flow

## 🚀 Production Deployment

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
```

### Security Considerations

- Use HTTPS in production
- Implement rate limiting
- Add monitoring and logging
- Regular security audits
- Keep dependencies updated

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/) - JWT token information
- [React Context API](https://react.dev/learn/passing-data-deeply-with-context)

## 🤝 Contributing

When contributing to the authentication system:

1. Follow TypeScript best practices
2. Maintain consistent styling with Tailwind
3. Add proper error handling
4. Include loading states
5. Test on multiple devices
6. Update documentation

## 📞 Support

For issues or questions about the authentication system:

1. Check the error logs
2. Verify environment configuration
3. Test API endpoints
4. Review browser console
5. Check network requests

---

**Note**: This authentication system is designed to work with your existing Express backend. Ensure all API endpoints are properly implemented and tested before deployment.
