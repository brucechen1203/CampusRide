const express = require('express');
const app = express();
const port = 3000;
const db = require('./database.js');
const bcrypt = require('bcrypt');
const saltRounds = 10; // The higher the number, the more secure, but slower

app.use(express.static('public'));
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API: Register a new user
app.post('/api/users/register', async (req, res) => {
    try {
        const { name, email, password, is_driver } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into the database
        const sql = `INSERT INTO users (name, email, password, is_driver) VALUES (?, ?, ?, ?)`;
        db.run(sql, [name, email, hashedPassword, is_driver || false], function(err) {
            if (err) {
                // Check for unique constraint violation (email already exists)
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Email already exists.' });
                }
                console.error(err.message);
                return res.status(500).json({ error: 'Database error occurred.' });
            }
            res.status(201).json({ id: this.lastID, message: 'User registered successfully.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred.' });
    }
});

// API: User Login
app.post('/api/users/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const sql = `SELECT * FROM users WHERE email = ?`;
        db.get(sql, [email], async (err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error occurred.' });
            }
            
            // Check if user exists
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
            }

            // Compare password with the hashed password in the database
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                // Passwords match
                res.status(200).json({ 
                    message: 'Login successful.',
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        is_driver: user.is_driver
                    }
                });
            } else {
                // Passwords don't match
                return res.status(401).json({ error: 'Invalid credentials. Please check your email and password.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error occurred.' });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
