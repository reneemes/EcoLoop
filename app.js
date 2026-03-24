require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Import route files
const sessionRoutes = require('./routes/session.routes.js');
const userRoutes = require('./routes/user.routes.js');
const chatRoutes = require('./routes/chat.routes.js');
const geoRoutes = require('./routes/geolocation.routes.js');
const recycleRoutes = require('./routes/recycle.routes.js');

// create an express application
const app = express();

// middleware → allows cross-origin requests
const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.FRONTEND_URL // production
];
app.use(cors({
  origin: function (origin, callback) {
    // allow tools like Postman or curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true
}));

// allows us to parse JSON data from requests
app.use(express.json());
// allows you to read the cookies. Example: req.cookies.token
app.use(cookieParser());

app.use('/api/v1/session', sessionRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/geo', geoRoutes);
app.use('/api/v1/recycle', recycleRoutes);

module.exports = app;