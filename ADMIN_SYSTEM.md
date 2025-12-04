# Admin System Documentation

## Overview

A comprehensive admin panel has been implemented for the OCP platform with full user management capabilities.

## Features

### 1. Admin Navbar
- **Visible only to admin users**
- Navigation items:
  - Dashboard
  - Manage Users
  - File Manager (Library)
  - Settings
  - Logout

### 2. Admin Dashboard (`/admin/dashboard`)
- User statistics (Total, Active, Admins, Suspended)
- Conversation statistics
- Quick action buttons
- Real-time data visualization

### 3. Manage Users

#### List Users (`/admin/users`)
- **Features:**
  - Table listing all users with:
    - ID, Name, Email
    - Role (admin/user)
    - Status (active/suspended)
    - Created date
  - Actions: Edit, Email, Suspend/Activate, Delete
  - Search by email or name
  - Filter by role and status
  - Pagination support

#### Add New User (`/admin/users/create`)
- **Form fields:**
  - Name (required)
  - Email (required)
  - Password (required, min 6 chars)
  - Role (user/admin)
  - Status (active/inactive)
- **Actions:**
  - Creates user in database
  - Redirects to user list
  - Shows success message

#### Edit User (`/admin/users/[id]`)
- **Form fields:**
  - Name
  - Email
  - Role
  - Status
- **Additional actions:**
  - Reset password
  - Suspend/Activate user
  - Delete user
  - Send email
- **User details panel** showing ID, creation date, last updated

#### Send Email (`/admin/users/[id]/email`)
- **Form:**
  - Subject (required)
  - Message body (required)
- **Features:**
  - Quick email templates (Welcome, Update, Action Required)
  - Recipient information panel
  - HTML formatting support

### 4. Settings (`/admin/settings`)
- Settings configuration page (coming soon)
- Placeholder for:
  - Notifications
  - Security
  - Appearance
  - Localization

## File Structure

```
/admin
   /dashboard
      page.jsx                  // Admin dashboard
   /users
      page.jsx                  // List users
      create/
         page.jsx               // Create user
      [id]/
         page.jsx               // Edit user
         email/
            page.jsx            // Send email to user
   /settings
      page.jsx                  // Settings page

/components
   AdminNavbar.jsx              // Admin navigation bar
   UserTable.jsx                // User list table component
   UserForm.jsx                 // User create/edit form
   EmailForm.jsx                // Email sending form

/lib
   middleware/
      adminAuth.js              // Admin authentication middleware
   services/
      userService.js            // User CRUD operations
      emailService.js           // Email sending logic
   
/api/admin
   stats/
      route.js                  // Dashboard statistics
   users/
      route.js                  // List/Create users
      [id]/
         route.js               // Get/Update/Delete user
         email/
            route.js            // Send email to user
```

## API Endpoints

### Statistics
- `GET /api/admin/stats` - Get dashboard statistics

### Users Management
- `GET /api/admin/users` - List all users (with filters, search, pagination)
- `POST /api/admin/users` - Create new user
- `GET /api/admin/users/[id]` - Get user by ID
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user (soft delete)
- `PATCH /api/admin/users/[id]` - Toggle status or reset password
- `POST /api/admin/users/[id]/email` - Send email to user

## Security

### Authentication & Authorization
- JWT token verification for all admin routes
- Role-based access control (RBAC)
- Only users with `role: 'admin'` can access admin panel
- Suspended accounts cannot access the system
- Token expiration handling

### Middleware
`verifyAdmin(request)` - Checks:
1. Valid JWT token
2. User exists in database
3. User is active
4. User has admin role

### Protected Routes
All `/admin/*` routes are protected and require admin authentication.

## User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: 'user' | 'admin',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Creating Your First Admin User

You can create an admin user via MongoDB directly or by registering and updating the role:

```javascript
// Using MongoDB Compass or shell
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or use the registration endpoint and then update:

```bash
# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'

# Then update role in database
```

### Access Admin Panel

1. Login with admin credentials
2. The navbar will automatically show admin menu items
3. Navigate to Dashboard or Manage Users
4. Start managing your platform!

## Email Service

Currently using a **placeholder implementation** that logs emails to console.

### To Enable Real Email Sending:

Update `/lib/services/emailService.js` to use:
- **SendGrid**
- **AWS SES**
- **Nodemailer** with SMTP
- **Resend**

Example with Nodemailer:

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmailToUser(userEmail, subject, message) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: subject,
    html: message,
  });
}
```

## UI/UX Features

- **TailwindCSS** for styling
- **Dark/Light mode** support
- **Responsive design** - works on mobile, tablet, desktop
- **Reusable components**
- **Loading states**
- **Toast notifications**
- **Confirmation modals**
- **Smooth animations**

## Environment Variables

Add to your `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key-here

# Optional: Email service (if configured)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password
SMTP_FROM=noreply@example.com
```

## Best Practices

### Security
- ✅ All passwords are hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Admin-only route protection
- ✅ Input validation on all forms
- ✅ CSRF protection via Next.js
- ✅ No password exposure in API responses

### User Management
- ✅ Soft delete (isActive: false) instead of permanent deletion
- ✅ Email uniqueness validation
- ✅ Role-based access control
- ✅ Account suspension functionality

### Code Quality
- ✅ Modular service layer
- ✅ Reusable components
- ✅ Error handling
- ✅ Consistent naming conventions
- ✅ Clean code structure

## Future Enhancements

- [ ] Bulk user operations (import/export CSV)
- [ ] Advanced user filters and sorting
- [ ] User activity logs
- [ ] Email templates management
- [ ] Advanced settings panel
- [ ] User groups and permissions
- [ ] Two-factor authentication (2FA)
- [ ] Password reset via email
- [ ] User profile pictures upload
- [ ] Advanced analytics and reporting

## Troubleshooting

### Admin navbar not showing
- Verify user role is set to 'admin' in database
- Clear cookies and login again
- Check browser console for errors

### Cannot access admin pages
- Ensure JWT_SECRET is set in environment
- Verify token is valid and not expired
- Check user has admin role and isActive: true

### Email not sending
- Email service is currently a placeholder
- Configure real email service (see Email Service section)
- Check SMTP credentials if configured

## Support

For issues or questions, check:
1. Browser console for frontend errors
2. Terminal logs for backend errors
3. MongoDB logs for database issues
4. Network tab for API request/response details

---

**Admin Panel Version:** 1.0.0  
**Last Updated:** December 4, 2025
