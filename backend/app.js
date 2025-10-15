// server.js

// 1. Load environment variables from .env file
require('dotenv').config();

// 2. Import Express
const express = require('express');

// 3. Initialize the Express application
const app = express();

// 4. Set the port from the environment variables, or default to 5050
// We use 5050 here, as 5000 is used by your database.
const port = process.env.PORT || 5050; 

// 5. Middleware (e.g., for parsing JSON body requests)
app.use(express.json());

// 6. Basic Route
app.get('/', (req, res) => {
    res.send('Agrilink API is running!');
});

// 7. Start the server
app.listen(port, () => {
    // Acknowledge the use of port 5050 based on your saved preference
    console.log(`✅ Server listening on port ${port} (http://localhost:${port})`);
});