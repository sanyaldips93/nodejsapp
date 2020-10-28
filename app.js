// Library Imports
const fs = require('fs')
const path = require('path')

// External Imports
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// File Imports
const connectDB = require('./config/db');

// Route Imports
const publicRoute = require('./routes/routes.public');
const authRoute = require('./routes/routes.auth');

const app = express();

// Initializing config environment
dotenv.config({ path: './config/config.env' });

// Initialising Database
connectDB();

// Logging: Console and File
app.use(morgan('tiny'));
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));

// Bodyparser
app.use(express.json());

// Cookieparser
app.use(cookieParser());

app.use(publicRoute);
app.use('/auth', authRoute);

// Server listening
app.listen(process.env.PORT, () => console.log('Server connected!'));
