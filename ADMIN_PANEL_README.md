# ReClaimIt Admin Panel

A comprehensive admin panel for managing the ReClaimIt lost and found application.

## Features

### 🔐 Authentication & Security
- **Separate Admin Login**: Dedicated admin login route (`/admin/login`)
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin-only access to sensitive operations
- **Protected Routes**: All admin endpoints require valid admin token

### 📊 Dashboard
- **Real-time Statistics**: Total users, blocked users, items, and recent activity
- **Quick Actions**: Direct navigation to user and item management
- **Recent Activity**: Last 7 days of found and lost item reports

### 👥 User Management
- **View All Users**: Complete user list with pagination
- **Search & Filter**: Search by name, email, or roll number
- **Status Management**: Block/unblock users (toggle active/blocked status)
- **User Details**: Comprehensive user information including posted items
- **Role Protection**: Cannot modify admin accounts

### 📦 Item Management
- **View All Items**: Both found and lost items in one interface
- **Search & Filter**: Search by title, description, or category
- **Type Filtering**: Filter by found, lost, or all items
- **Item Details**: Full item information with images
- **Delete Items**: Permanently remove inappropriate or resolved items

### 🛡️ Security Features
- **Admin Middleware**: Verifies admin role and token validity
- **Status Checks**: Prevents blocked admins from accessing the system
- **Input Validation**: Server-side validation for all operations
- **Error Handling**: Comprehensive error handling and user feedback

## Setup Instructions

### 1. Server Setup

The admin panel is already integrated into the server. No additional setup required.

### 2. Create Admin User

Run the following command to create the default admin user:

```bash
cd server
npm run create-admin
```

**Default Admin Credentials:**
- Email: `admin@reclaimit.com`
- Password: `admin123`

⚠️ **Important**: Change the default password after first login!

### 3. Access Admin Panel

Navigate to `/admin/login` in your browser to access the admin panel.

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Dashboard
- `GET /api/admin/dashboard` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - Get all users (with pagination and filters)
- `GET /api/admin/users/:userId` - Get specific user details
- `PATCH /api/admin/users/:userId/status` - Toggle user status

### Item Management
- `GET /api/admin/items` - Get all items (with pagination and filters)
- `DELETE /api/admin/items/:type/:itemId` - Delete specific item

## Usage Guide

### 1. Admin Login
- Navigate to `/admin/login`
- Use admin credentials to log in
- You'll be redirected to the dashboard upon successful login

### 2. Dashboard Overview
- View key statistics at a glance
- Use quick action buttons to navigate to different sections
- Monitor recent activity

### 3. Managing Users
- Navigate to "Manage Users" from dashboard
- Use search and filters to find specific users
- Click the eye icon to view user details
- Use the shield/check icon to block/unblock users
- View user statistics and posted items

### 4. Managing Items
- Navigate to "Manage Items" from dashboard
- Filter by item type (found/lost) or search by keywords
- Click "View Details" to see full item information
- Use the trash icon to delete inappropriate items
- Confirm deletion in the confirmation modal

### 5. Navigation
- Use the back arrow buttons to return to the dashboard
- All admin pages have consistent navigation
- Logout button is available in the top-right corner

## Security Considerations

### Admin Account Protection
- Admin accounts cannot be blocked or modified through the interface
- Admin tokens have a 24-hour expiration
- Failed authentication attempts are logged

### Data Access
- Admins have read-only access to most data
- Only specific actions (delete items, toggle user status) are allowed
- All actions are logged and require confirmation

### Token Management
- Admin tokens are stored in localStorage
- Automatic logout on token expiration
- Secure token validation on all requests

## Troubleshooting

### Common Issues

1. **"Access denied" error**
   - Ensure you're using admin credentials
   - Check if your account is blocked
   - Verify admin role in database

2. **"User not found" error**
   - Refresh the page and try again
   - Check if the user was deleted by another admin

3. **"Failed to load" errors**
   - Check server connection
   - Verify admin token is valid
   - Try logging out and back in

### Database Issues

1. **Admin user not created**
   - Run `npm run create-admin` again
   - Check MongoDB connection
   - Verify User model exists

2. **Permission errors**
   - Ensure admin role is set to 'admin' in database
   - Check if status is 'active'

## Development Notes

### Adding New Admin Features

1. **Backend**: Add new endpoints in `adminController.js`
2. **Frontend**: Create new admin pages and add routes
3. **Middleware**: Ensure proper admin authentication
4. **Testing**: Test with both admin and regular user accounts

### Customization

- Modify admin credentials in `createAdmin.js`
- Adjust pagination limits in admin controllers
- Customize dashboard statistics
- Add new admin roles if needed

## Support

For technical support or feature requests, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Compatibility**: ReClaimIt v1.0+
