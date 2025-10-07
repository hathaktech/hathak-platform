# Admin System Documentation

## Overview

The HatHak platform now includes a comprehensive admin system with role-based permissions and a separate admin database. This system provides secure administrative access with granular permission controls.

## Features

### 🔐 Separate Admin Database
- **Private Admin Collection**: Admins are stored in a separate MongoDB collection (`admins`)
- **Isolated from Users**: Admin accounts are completely separate from regular user accounts
- **Enhanced Security**: Admin tokens have shorter expiration (24h vs 7d for users)

### 👥 Role-Based Access Control
The system supports four admin roles with different permission levels:

#### 1. **Admin** (Full Access)
- All permissions enabled
- Can create and manage other admins
- Can grant/revoke permissions
- Full system access

#### 2. **Manager** (High-Level Access)
- User management
- Product management
- Order management
- Financial access
- Analytics access
- Cannot create admins or grant permissions

#### 3. **Employee** (Mid-Level Access)
- Product management
- Order management
- Analytics access
- No user management or financial access

#### 4. **Worker** (Basic Access)
- Order management only
- Limited system access

### 🛡️ Permission System
Each admin has granular permissions:

- `userManagement`: Manage user accounts
- `productManagement`: Manage products and inventory
- `orderManagement`: Process and manage orders
- `financialAccess`: View financial data and reports
- `systemSettings`: Configure system settings
- `analyticsAccess`: View analytics and reports
- `canGrantPermissions`: Grant/revoke permissions to other admins
- `canCreateAdmins`: Create new admin accounts

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/auth/me` - Get current admin
- `PUT /api/admin/auth/change-password` - Change password

### Admin Management (Admin Only)
- `POST /api/admin/auth/register` - Create new admin
- `GET /api/admin/auth/admins` - List all admins
- `PUT /api/admin/auth/permissions/:id` - Update admin permissions
- `DELETE /api/admin/auth/:id` - Delete admin

## Frontend Pages

### Admin Login
- **URL**: `/admin/login`
- **Features**: Secure login form with admin-specific styling
- **Security**: Separate from regular user login

### Admin Dashboard
- **URL**: `/admin`
- **Features**: 
  - System overview and statistics
  - Quick access to management tools
  - Permission-based navigation
  - Recent activity feed

### Admin Management
- **URL**: `/admin/admins`
- **Features**:
  - List all admin accounts
  - View permissions and roles
  - Activate/deactivate accounts
  - Delete admin accounts (admin only)

### Unauthorized Access
- **URL**: `/admin/unauthorized`
- **Features**: Error page for insufficient permissions

## Security Features

### 🔒 Token Security
- Admin tokens include `type: 'admin'` to distinguish from user tokens
- Shorter expiration time (24 hours)
- Automatic token validation on each request

### 🛡️ Middleware Protection
- `adminAuthMiddleware`: Validates admin tokens
- `requirePermission`: Checks specific permissions
- `requireRole`: Validates admin roles
- `canManageAdmins`: Ensures only admins can manage other admins

### 🔐 Route Protection
- All admin routes require authentication
- Permission-based access control
- Role-based restrictions
- Automatic redirects for unauthorized access

## Database Migration

### Existing Admin Users
The system includes a migration script (`adminSeeder.js`) that:
- Finds existing admin users in the User collection
- Creates corresponding admin accounts in the Admin collection
- Preserves existing passwords (already hashed)
- Creates a default admin account if none exist

### Default Admin Account
- **Email**: `admin@hathak.com`
- **Password**: `admin123456`
- **Role**: `admin` (full permissions)

## Usage Instructions

### 1. Run Migration
```bash
cd backend
node adminSeeder.js
```

### 2. Access Admin Panel
1. Navigate to `/admin/login`
2. Use admin credentials to log in
3. Access the admin dashboard at `/admin`

### 3. Create Additional Admins
1. Log in as an admin
2. Navigate to Admin Management
3. Click "Add Admin"
4. Fill in admin details and select role
5. Save to create new admin account

### 4. Manage Permissions
1. Go to Admin Management
2. Click edit on any admin
3. Modify permissions or role
4. Save changes

## File Structure

### Backend Files
```
backend/
├── models/Admin.js                    # Admin model with permissions
├── controllers/adminAuthController.js # Admin authentication logic
├── middleware/adminAuthMiddleware.js  # Admin route protection
├── routes/adminAuthRoutes.js         # Admin API routes
├── adminSeeder.js                    # Migration script
└── App.js                           # Updated with admin routes
```

### Frontend Files
```
frontend/src/
├── app/admin/
│   ├── login/page.tsx               # Admin login page
│   ├── unauthorized/page.tsx        # Unauthorized access page
│   ├── admins/page.tsx             # Admin management page
│   └── layout.tsx                  # Updated admin layout
├── components/admin/
│   ├── AdminLoginForm.tsx          # Admin login form
│   ├── RequireAdminAuth.tsx        # Route protection component
│   └── AdminDashboard.tsx          # Updated dashboard
├── context/AdminAuthContext.tsx     # Admin authentication context
└── services/adminAuthService.ts     # Admin API service
```

## Best Practices

### 🔐 Security
- Use strong passwords for admin accounts
- Regularly review admin permissions
- Monitor admin activity logs
- Implement two-factor authentication (future enhancement)

### 👥 User Management
- Create admins with minimal required permissions
- Regularly audit admin access
- Deactivate unused admin accounts
- Use descriptive notes for admin accounts

### 🛠️ Maintenance
- Monitor system health and performance
- Keep admin system updated
- Regular security audits
- Backup admin database regularly

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Admin activity logging
- [ ] Session management
- [ ] Bulk admin operations
- [ ] Admin role templates
- [ ] Advanced permission inheritance
- [ ] Admin audit trails

## Support

For issues or questions regarding the admin system:
1. Check the console for error messages
2. Verify admin permissions
3. Ensure proper database connection
4. Review API endpoint responses

The admin system provides a robust foundation for managing the HatHak platform with enterprise-level security and flexibility.
