const express = require('express');
const session = require('express-session');
const connectDB = require("./mongooDb");
require('dotenv').config();
const cors = require('cors'); // Import the cors middleware

const authRoutes = require('./routes/authRoutes');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors({
  origin: 'http://localhost:3001',
}));

// Routes
app.use('/auth', authRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
