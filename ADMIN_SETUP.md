# Admin Role System

## Overview
The application now has an admin role system that restricts file management (upload and delete) to admin users only.

## Features
- ✅ Admin role field in User model
- ✅ Admin middleware for API route protection
- ✅ Library API requires admin for POST/DELETE operations
- ✅ Library UI hides upload/delete buttons for non-admins
- ✅ Admin badge displayed in navbar
- ✅ Admin banner in library page

## How to Make a User Admin

### Method 1: Using Setup Secret (First Admin)
For the initial setup, you can use a special secret key to make your first admin user.

1. Add this to your `.env` file:
```bash
ADMIN_SETUP_SECRET=your-secure-random-secret-key-here
```

2. Make a POST request to create the first admin:
```bash
curl -X POST http://localhost:3000/api/users/make-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "setupSecret": "your-secure-random-secret-key-here"
  }'
```

Or using JavaScript fetch:
```javascript
const response = await fetch('/api/users/make-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    setupSecret: 'your-secure-random-secret-key-here'
  })
});
const data = await response.json();
console.log(data);
```

### Method 2: Existing Admin Makes New Admin
Once you have at least one admin, they can promote other users:

```bash
curl -X POST http://localhost:3000/api/users/make-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "email": "newadmin@example.com"
  }'
```

### Method 3: Direct Database Update (MongoDB)
If you have direct database access:

```javascript
// Connect to your MongoDB
use your_database_name;

// Update user to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

## User Registration Default Role
By default, all new users are registered as 'user' role. The role field in the User model has:
- **Values**: 'user' or 'admin'
- **Default**: 'user'

## Admin Privileges
Admins can:
- Upload files to the library
- Delete files from the library
- Promote other users to admin (via API)
- See admin badge in navbar
- See admin banner in library page

## Regular Users
Regular users can:
- View all files in the library
- Download files
- Use the chatbot
- Manage their own conversations

## Security Notes
1. **Keep `ADMIN_SETUP_SECRET` secure** - Remove it from `.env` after creating the first admin
2. Admin authentication is checked on the server side for all protected operations
3. UI restrictions are for UX only - server-side checks prevent unauthorized access
4. JWT tokens contain user role information

## API Endpoints

### File Management (Admin Only)
- `POST /api/library` - Upload file (requires admin)
- `DELETE /api/library?filename=<name>` - Delete file (requires admin)
- `GET /api/library` - List files (public)

### User Management
- `POST /api/users/make-admin` - Make user admin (requires admin OR setup secret)

## Example Workflow
1. Register a regular user account via `/register`
2. Use Method 1 to promote your account to admin
3. Login with the admin account
4. You'll see the admin badge in navbar and upload/delete options in library
5. Use the admin account to promote other users as needed

## Troubleshooting

### "Access denied" when uploading/deleting
- Ensure you're logged in as an admin user
- Check that the JWT token includes `role: 'admin'`
- Verify the token is being sent in the Authorization header

### Admin badge not showing
- Clear cookies and re-login
- Check that the user cookie has the updated role information
- The user cookie is set during login from the database role field
