// auth.js
require('dotenv').config();
const axios = require('axios');

// Configuration for Ninja Van API
const TOKEN_ENDPOINT = 'https://api.ninjavan.co/1.0/oauth/token';
const CLIENT_ID = process.env.NINJA_VAN_CLIENT_ID;
const CLIENT_SECRET = process.env.NINJA_VAN_CLIENT_SECRET;

let accessToken = {
    value: null,
    expires: null
};

/**
 * Retrieves a new access token from Ninja Van's OAuth server and updates the accessToken object.
 */
async function getNewToken() {
    try {
        const response = await axios.post(TOKEN_ENDPOINT, {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials'
        });

        const { access_token, expires_in } = response.data;
        accessToken.value = access_token;
        accessToken.expires = Date.now() + expires_in * 1000; // Convert expires_in to milliseconds and add to current time
        console.log('New access token retrieved and stored.');
    } catch (error) {
        console.error('Failed to retrieve access token:', error.response ? error.response.data : error);
        accessToken.value = null;  // Ensure no stale token is kept
    }
}

/**
 * Checks if the current access token is valid and retrieves a new one if necessary.
 */
async function getToken() {
    // Check if token is either missing or close to expiration (5 minutes before)
    if (!accessToken.value || accessToken.expires < Date.now() + 300000) {
        console.log('Access token is missing or expiring soon. Retrieving a new one...');
        await getNewToken();
    }
    return accessToken.value;
}

module.exports = { getToken };
