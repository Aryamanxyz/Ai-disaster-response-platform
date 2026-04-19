const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;