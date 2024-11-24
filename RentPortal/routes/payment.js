const express = require('express');
const router = express.Router();

// Define your payment routes here
router.get('/', (req, res) => {
    res.send('Payment route');
});

module.exports = router;
