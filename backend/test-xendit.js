// Test file untuk mengecek Xendit integration
require('dotenv').config();
const { Xendit } = require('xendit-node');

console.log('🔍 Debugging Xendit Integration\n');

// 1. Check API Key
const apiKey = process.env.XENDIT_API_KEY;
console.log('1. API Key Status:');
if (apiKey) {
  console.log('   ✅ API Key ditemukan');
  console.log('   Key format:', apiKey.substring(0, 15) + '...');
  console.log('   Starts with xnd_:', apiKey.startsWith('xnd_'));
} else {
  console.log('   ❌ API Key NOT found');
}

// 2. Initialize Xendit
console.log('\n2. Xendit Initialization:');
try {
  const xendit = new Xendit({
    secretKey: apiKey,
  });
  console.log('   ✅ Xendit initialized successfully');
  console.log('   Invoice module:', xendit.Invoice ? '✅ Available' : '❌ Not available');
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// 3. Test Invoice Creation (simulated)
console.log('\n3. Test Payload Structure:');
const testPayload = {
  amount: 50000,
  invoiceCode: 'SKN-123456',
  description: 'Test Invoice',
  customer: {
    givenNames: 'John Doe',
    email: 'john@test.com',
    mobileNumber: '081234567890',
  },
  paymentMethods: ['EWALLET'],
  successRedirectUrl: 'http://localhost:5174/order-success',
  failureRedirectUrl: 'http://localhost:5174/payment',
  currency: 'IDR',
};
console.log('   ', JSON.stringify(testPayload, null, 2));

console.log('\n4. Next Steps:');
console.log('   ✓ Buka http://localhost:5174 di browser');
console.log('   ✓ Tambah produk ke cart');
console.log('   ✓ Checkout dan masuk payment page');
console.log('   ✓ Lihat console browser untuk error details');
