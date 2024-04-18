// orders.js
const axios = require('axios');
const { getToken } = require('./auth');

const createOrder = async (orderDetails) => {
    // Your existing order creation code
};

const cancelOrder = async (countryCode, trackingNo) => {
    // Your existing order cancellation code
};

module.exports = { createOrder, cancelOrder };
