const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************

const userDatabase = [];
let nextUserId = 1;

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    // Create new user object
    const newUser = { 
        id: nextUserId++, 
        name, 
        email 
    };

    // Save user to database
    userDatabase.push(newUser);

    // Send response
    res.status(201).json(newUser);
});

// Get user by ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Validate user ID
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find user in database
    const user = userDatabase.find(user => user.id === userId);

    // Check if user exists
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Send response
    res.json(user);
});

// Update user by ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;

    // Validate user ID
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Validate input
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }

    // Find user in database
    const userIndex = userDatabase.findIndex(user => user.id === userId);

    // Check if user exists
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    userDatabase[userIndex] = { 
        ...userDatabase[userIndex], 
        name, 
        email 
    };

    // Send response
    res.json(userDatabase[userIndex]);
});

// Delete user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Validate user ID
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Find user in database
    const userIndex = userDatabase.findIndex(user => user.id === userId);

    // Check if user exists
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Remove user from database
    userDatabase.splice(userIndex, 1);

    // Send response
    res.status(204).send();
});

// Do not touch the code below this comment
// **************************************************************

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app; // Export the app for testing