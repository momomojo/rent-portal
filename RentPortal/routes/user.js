const express = require('express');
const router = express.Router();

// Define your user routes here
router.get('/', (req, res) => {
    res.send('User route');
});

// Example: Register a new user
router.post('/register', (req, res) => {
    // Handle user registration logic here
    res.send('User registered successfully');
});

// Example: User login
router.post('/login', (req, res) => {
    // Handle user login logic here
    res.send('User logged in successfully');
});

module.exports = router;
