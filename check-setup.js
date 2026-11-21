const fs = require('fs');
const path = require('path');

console.log('🔍 Kiểm tra cấu trúc dự án...\n');

const checks = {
  passed: [],
  failed: []
};

// Kiểm tra các file quan trọng
const requiredFiles = [
  'package.json',
  '.env',
  'server.js',
  'seedData.js',
  'README.md',
  'models/User.js',
  'models/Role.js',
  'models/JobPosting.js',
  'routes/auth.js',
  'routes/users.js',
  'routes/jobs.js',
  'middleware/auth.js',
  'public/index.html',
  'public/css/style.css',
  'public/js/api.js',
  'public/js/app.js'
];

console.log('📂 Kiểm tra files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    checks.passed.push(`✅ ${file}`);
  } else {
    checks.failed.push(`❌ ${file} - MISSING`);
  }
});

// Kiểm tra node_modules
if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
  checks.passed.push('✅ node_modules (Dependencies installed)');
} else {
  checks.failed.push('❌ node_modules - RUN: npm install');
}

// Kiểm tra .env
console.log('\n⚙️ Kiểm tra file .env...');
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  if (envContent.includes('MONGODB_URI')) {
    checks.passed.push('✅ .env có MONGODB_URI');
  } else {
    checks.failed.push('❌ .env thiếu MONGODB_URI');
  }
  if (envContent.includes('JWT_SECRET')) {
    checks.passed.push('✅ .env có JWT_SECRET');
  } else {
    checks.failed.push('❌ .env thiếu JWT_SECRET');
  }
} catch (err) {
  checks.failed.push('❌ Không đọc được .env');
}

// Kết quả
console.log('\n' + '='.repeat(50));
console.log('📊 KẾT QUẢ KIỂM TRA\n');

if (checks.passed.length > 0) {
  console.log('✅ PASSED (' + checks.passed.length + '):');
  checks.passed.forEach(item => console.log('  ' + item));
}

if (checks.failed.length > 0) {
  console.log('\n❌ FAILED (' + checks.failed.length + '):');
  checks.failed.forEach(item => console.log('  ' + item));
}

console.log('\n' + '='.repeat(50));

if (checks.failed.length === 0) {
  console.log('\n✅ TẤT CẢ KIỂM TRA ĐÃ PASS!');
  console.log('\n📋 Các bước tiếp theo:');
  console.log('  1. Cài MongoDB: https://www.mongodb.com/try/download/community');
  console.log('  2. Khởi động MongoDB: net start MongoDB');
  console.log('  3. Test kết nối: node test-connection.js');
  console.log('  4. Import data: node seedData.js');
  console.log('  5. Chạy server: npm start');
  console.log('  6. Truy cập: http://localhost:5000');
} else {
  console.log('\n⚠️ CÓ LỖI CẦN SỬA!');
  console.log('Vui lòng kiểm tra các file bị thiếu ở trên.');
}

console.log('');
