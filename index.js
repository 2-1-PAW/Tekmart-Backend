const express = require('express');
const morgan = require("morgan"); // lock htpp request
const bodyParser = require("body-parser"); // parsing body from request
const cookieParser = require("cookie-parser"); // parsing cookie from request
const cors = require("cors"); // allow request from different origin 
const app = express();

// DOTENV CONFIG
const dotenv = require("dotenv");
dotenv.config();

// Connect to database
const connectDB = require('./configs/database.js');
connectDB();

// Middleware 
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, // Enable credentials in CORS
})); // don't forget to configure cors at production

// REST API
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/user', userRoutes); 
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes); 
app.use('/api/payment', paymentRoutes);

// Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});