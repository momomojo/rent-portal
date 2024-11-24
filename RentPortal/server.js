const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const paymentRoutes = require('./routes/payment');
const messageRoutes = require('./routes/message');

app.use(express.json());

// Route imports
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});