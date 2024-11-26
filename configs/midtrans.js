const midtransClient = require('midtrans-client');

// Midtrans Setup using Snap (Built-In Checkout Page)
const snap = new midtransClient.Snap({
    isProduction: false, // false for sandbox environment or simulation (not paid)
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  });

module.exports = snap;