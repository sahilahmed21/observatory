
const express = require('express');
const { createObservatoryAgent } = require('observatory-agent');

const app = express();
const PORT = 4000; // Run it on a different port

// --- Observatory Agent Setup ---
const observatoryMiddleware = createObservatoryAgent({
    apiKey: '03fdc35af7bb60152ce8503216533bdfca0b7367b1d75f5b', // <-- IMPORTANT: PASTE YOUR REAL API KEY
});

app.use(observatoryMiddleware);
// -----------------------------

// Your API routes
app.get('/', (req, res) => {
    res.send('Sample App is running!');
});

app.get('/api/users', (req, res) => {
    // Simulate a database call
    setTimeout(() => {
        res.json([{ id: 1, name: 'John Doe' }]);
    }, 120);
});

app.get('/api/products/:id', (req, res) => {
    if (Math.random() > 0.5) {
        res.status(200).send(`Product ${req.params.id} found.`);
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(PORT, () => {
    console.log(`Sample app with agent listening on http://localhost:${PORT}`);
});