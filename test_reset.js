const axios = require('axios');
async function test() {
  const email = 'testuser123@example.com';
  try {
    console.log('Registering...');
    await axios.post('http://localhost:5223/Auth/register', {
      email, userName: 'testuser123', password: 'Password123!', firstName: 'Test', lastName: 'User'
    });
  } catch (e) {
    console.log(e.response?.data || e.message);
  }
  
  // We cannot easily confirm email without the OTP, but wait, the OTP is in DB or logged.
  // Actually, we just need to see what forgot-password does!
  try {
    console.log('Requesting reset password...');
    const res = await axios.post('http://localhost:5223/Auth/forgot-password', { email });
    console.log('Success:', res.data);
  } catch (e) {
    console.log('Error:', e.response?.data || e.message);
  }
}
test();
