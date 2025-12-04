# 🚀 Quick Start Guide - Admin System

## Setup Your First Admin User

### Option 1: Using Node.js Script (Recommended)

```bash
cd /home/ismail/Desktop/LLM
node setup-admin.js
```

Follow the prompts:
1. MongoDB URI (press Enter for default: `mongodb://localhost:27017`)
2. Database name (press Enter for default: `llm`)
3. Admin name
4. Admin email
5. Admin password (min 6 characters)

### Option 2: Using MongoDB Directly

**Via MongoDB Compass:**
1. Connect to your database
2. Find the `users` collection
3. Find a user or create one
4. Update the document:
   ```json
   {
     "role": "admin"
   }
   ```

**Via MongoDB Shell:**
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Option 3: Register Then Upgrade

1. Go to `http://localhost:3000/register`
2. Register a new account
3. Update the role in MongoDB (see Option 2)

## Access Admin Panel

1. **Start your application:**
   ```bash
   cd web
   npm run dev
   ```

2. **Login** at `http://localhost:3000/login`
   - Use your admin email and password

3. **Access Admin Features:**
   - The navbar will automatically show admin menu items
   - Click "Dashboard Admin" or "Gérer Utilisateurs"
   - Navigate to `/admin/dashboard` or `/admin/users`

## Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard with statistics |
| `/admin/users` | List and manage all users |
| `/admin/users/create` | Create a new user |
| `/admin/users/[id]` | Edit user details |
| `/admin/users/[id]/email` | Send email to user |
| `/admin/settings` | Admin settings (coming soon) |

## Features Available

### Dashboard
- ✅ View total users, active users, admins, suspended users
- ✅ View conversation statistics
- ✅ Quick action buttons

### User Management
- ✅ **List Users**: Search, filter, paginate
- ✅ **Create User**: Add new users with role assignment
- ✅ **Edit User**: Update user information
- ✅ **Reset Password**: Admin can reset user passwords
- ✅ **Suspend/Activate**: Toggle user account status
- ✅ **Delete User**: Remove users from system
- ✅ **Send Email**: Send emails to individual users

## Security

All admin routes are protected:
- ✅ JWT authentication required
- ✅ Admin role verification
- ✅ Active account check
- ✅ Token expiration handling

Non-admin users will be redirected to home if they try to access admin routes.

## Testing the System

1. **Create admin user** (see setup above)
2. **Login** with admin credentials
3. **Verify** admin menu items appear
4. **Navigate** to dashboard
5. **Test** user management features

## Troubleshooting

**Admin menu not showing?**
- Verify user role is "admin" in database
- Clear browser cookies and login again
- Check browser console for errors

**Cannot access admin pages?**
- Ensure JWT_SECRET is in your `.env.local`
- Verify MongoDB is running
- Check terminal for backend errors

**Email not sending?**
- Email service is currently a placeholder (logs to console)
- Configure real email service in `lib/services/emailService.js`

## Environment Variables

Ensure your `.env.local` has:
```env
MONGODB_URI=mongodb://localhost:27017/llm
JWT_SECRET=your-secret-key-here
```

## Next Steps

1. ✅ Create your admin user
2. ✅ Login and explore the admin panel
3. ✅ Create test users
4. ✅ Test all features
5. 📧 Configure email service (optional)
6. 🎨 Customize UI if needed

## Support

- See `ADMIN_SYSTEM.md` for detailed documentation
- See `ADMIN_IMPLEMENTATION_SUMMARY.md` for complete feature list
- Check browser console and terminal logs for debugging

---

**Ready to go! Enjoy your admin panel! 🎉**
