const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB connection...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connection successful!');
    console.log('✅ Database:', mongoose.connection.name);
    console.log('✅ Host:', mongoose.connection.host);
    console.log('✅ Port:', mongoose.connection.port);
    mongoose.connection.close();
    console.log('\n✅ Test passed! You can now run: npm start');
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed!');
    console.error('Error:', err.message);
    console.log('\n⚠️ Make sure MongoDB is running:');
    console.log('   Windows: net start MongoDB');
    console.log('   Or run: mongod --dbpath="C:\\data\\db"');
    process.exit(1);
  });
