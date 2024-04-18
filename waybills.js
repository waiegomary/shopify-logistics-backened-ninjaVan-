// waybills.js
// const axios = require('axios');
const { getToken } = require('./auth'); // Ensure you have a function to get the OAuth token

/** 
 * Retrieves a waybill from Ninja Van's API using the tracking number.
 * @param {string} trackingNo The tracking number of the order.
 * @returns The waybill as a PDF or a URL to the PDF.
 */
const getWaybill = async (trackingNo) => {
    const accessToken = await getToken(); // Retrieve the OAuth token
    if (!accessToken) {
        console.error('Failed to retrieve access token');
        return null;
    }

    const apiUrl = `https://api-sandbox.ninjavan.co/sg/2.0/reports/waybill`;
    const params = {
        tids: trackingNo, // Replace ':trackingNo' with the actual tracking number
        h: 1              // Depending on API documentation, this might indicate to show/hide certain details
    };

    try {
        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}` // Ensure the token is passed correctly
            },
            params: params
        });
        console.log('Waybill retrieved successfully:', response.data);
        return response.data; // This might directly be a URL to the PDF or the PDF data itself
    } catch (error) {
        console.error('Failed to retrieve waybill:', error.response ? error.response.data : error.message);
        return null;
    }
};

module.exports = { getWaybill };
