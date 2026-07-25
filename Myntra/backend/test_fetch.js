const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    // 1. Create a dummy image
    const dummyPath = path.join(__dirname, 'dummy.png');
    fs.writeFileSync(dummyPath, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'));

    // 2. Login
    const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@myntra.com', password: 'password123' })
    });
    
    const loginData = await loginRes.json();
    if (!loginData.token) throw new Error("Login failed");
    
    // 3. Upload
    const FormData = require('form-data');
    const form = new FormData();
    form.append('images', fs.createReadStream(dummyPath));

    const uploadRes = await fetch('http://127.0.0.1:5000/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      },
      body: form
    });

    const uploadData = await uploadRes.json();
    console.log("Upload response:", uploadRes.status, uploadData);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testUpload();
