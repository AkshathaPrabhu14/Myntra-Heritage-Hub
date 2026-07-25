const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // Create a dummy image
    const dummyPath = path.join(__dirname, 'dummy.png');
    fs.writeFileSync(dummyPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'));

    const form = new FormData();
    form.append('images', fs.createReadStream(dummyPath));

    // We need to login as admin to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@myntra.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;

    console.log("Logged in, token:", token.substring(0, 10) + '...');

    const res = await axios.post('http://localhost:5000/api/upload', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Upload Success:", res.data);
  } catch (error) {
    if (error.response) {
      console.error("Upload Error:", error.response.status, error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
  }
}

testUpload();
