const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises; // use promises API
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const USERS_FILE = path.join(__dirname, 'users.json');

app.use(express.json());
app.use(cors());

// ---- helpers -----
async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    // if file doesn't exist yet, start with empty array
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// ---- routes -----
app.get('/', (_req, res) => {
  res.send('Server is working!');
});

// LOGIN 
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = await readUsers();
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid username or password' });

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// SIGNUP
app.post('/signup', async (req, res) => {
  try {
    let { username, password } = req.body;
    username = (username || '').trim();

    const users = await readUsers();
    if (users.find(u => u.username === username)) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Strength check
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashed = await bcrypt.hash(password, 10);
    users.push({ username, password: hashed });

    await writeUsers(users);
    return res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Error creating account' });
  }
});


// RESET PASSWORD
app.post('/reset-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    const users = await readUsers();
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) return res.status(404).json({ message: 'User not found' });

    // Don't allow same password as before
    const isSame = await bcrypt.compare(newPassword, users[idx].password);
    if (isSame) {
      return res.status(400).json({ message: 'New password must be different from the previous one' });
    }

    // Strength check
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash and save
    const hashed = await bcrypt.hash(newPassword, 10);
    users[idx].password = hashed;

    await writeUsers(users);
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    return res.status(500).json({ message: 'Could not update password' });
  }
});


// ---- start ------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
