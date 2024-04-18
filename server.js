require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const getToken = require('./auth');  // Import the getToken function

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const ninjaVanApiUrl = process.env.NINJA_VAN_API_URL;

// Middleware to allow CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Endpoint to create an order in Ninja Van
app.post('/create-order', async (req, res) => {
    const orderData = req.body;  // This should be the data necessary to create an order
    const accessToken = await getToken();  // Retrieve the OAuth token

    if (!accessToken) {
        return res.status(401).send('Authentication failed');
    }

    const apiUrl = `${process.env.NINJA_VAN_API_URL}/orders`; // Assuming NINJA_VAN_API_URL is the base URL from your .env

    try {
        const response = await axios.post(apiUrl, orderData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Order created:', response.data);
        res.status(201).send(response.data);
    } catch (error) {
        console.error('Failed to create order:', error.response ? error.response.data : error);
        res.status(error.response ? error.response.status : 500).send(error.response ? error.response.data : 'Server error');
    }
});


// Webhook endpoint for Ninja Van
app.post('/ninja-van-webhook', (req, res) => {
    console.log("Webhook received:", req.body);
    res.status(200).send("Received");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
