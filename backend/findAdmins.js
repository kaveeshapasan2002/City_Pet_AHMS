require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to database');
    const admins = await User.find({ role: 'Admin' }).select('name email role createdAt');
    console.log('\n=== Admin Users ===');
    if (admins.length === 0) {
      console.log('No admin users found in database');
    } else {
      admins.forEach(admin => {
        console.log(`\nName: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Role: ${admin.role}`);
        console.log(`Created: ${admin.createdAt}`);
        console.log('---');
      });
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
