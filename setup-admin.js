// setup-admin.js - Create your first admin user
// Usage: node setup-admin.js

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionPassword(prompt) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;
    
    stdout.write(prompt);
    stdin.resume();
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    
    let password = '';
    stdin.on('data', function(char) {
      char = char.toString('utf8');
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          password = password.slice(0, -1);
          stdout.clearLine();
          stdout.cursorTo(0);
          stdout.write(prompt + '*'.repeat(password.length));
          break;
        default:
          password += char;
          stdout.write('*');
          break;
      }
    });
  });
}

async function createAdmin() {
  console.log('================================');
  console.log('OCP Admin User Setup');
  console.log('================================\n');

  try {
    // Get database details
    const mongoUri = await question('Enter MongoDB URI (default: mongodb://localhost:27017): ') || 'mongodb://localhost:27017';
    const dbName = await question('Enter database name (default: llm): ') || 'llm';

    console.log('\nEnter admin user details:');
    const name = await question('Name: ');
    const email = await question('Email: ');
    const password = await questionPassword('Password (min 6 chars): ');

    // Validate inputs
    if (!name || !email || !password) {
      console.log('\n❌ All fields are required!');
      rl.close();
      process.exit(1);
    }

    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      rl.close();
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('\n\nConnecting to MongoDB...');
    await mongoose.connect(`${mongoUri}/${dbName}`);
    console.log('✅ Connected to MongoDB');

    // Define User model
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      isActive: Boolean,
    }), 'users');

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role === 'admin') {
        console.log('ℹ️  User already exists and is already an admin');
        await mongoose.disconnect();
        rl.close();
        process.exit(0);
      }
      // Update to admin
      existing.role = 'admin';
      await existing.save();
      console.log('✅ User updated to admin role');
      await mongoose.disconnect();
      rl.close();
      process.exit(0);
    }

    // Hash password
    console.log('\nHashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    console.log('Creating admin user...');
    const admin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\n================================');
    console.log('Login credentials:');
    console.log('================================');
    console.log('Email:', email);
    console.log('Password: [hidden for security]');
    console.log('\nYou can now login at: http://localhost:3000/login');
    console.log('================================\n');

    await mongoose.disconnect();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }
}

createAdmin();
