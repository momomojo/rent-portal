const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/messages', require('./routes/message'));

// Home Route
app.get('/', (req, res) => {
    res.send('Welcome to RentPortal API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
