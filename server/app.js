require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import route files
const sessionRoutes = require('./routes/session.routes.js');
const userRoutes = require('./routes/user.routes.js');

// create an express application
const app = express();

// middleware → allows cross-origin requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// allows us to parse JSON data from requests
app.use(express.json());
// allows you to read the cookies. Example: req.cookies.token
app.use(cookieParser());

app.use('/api/v1/session', sessionRoutes);
app.use('/api/v1/user', userRoutes);

// app.use((error, req, res, next) => {
//   // console.log(error);
//   res.status(500).json({ message: error.message });
// });

module.exports = app;