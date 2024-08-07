const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// const unspecifiedRouteHandler = require('./routes/unspecifiedRouteHandler.js');
const { finalErrorHandler } = require('./errorHandler/apiErrorHandler');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const locationRoutes = require('./routes/locationRoutes');
const venderRoute = require('./routes/venderRoutes');

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/gmp/file', express.static("public/property_files"));
app.use('/gmp/image', express.static("public/images"));

app.use('/gmp/api/admin', adminRoutes);
app.use('/gmp/api/vender', venderRoute);
app.use('/gmp/api/user', userRoutes);
app.use('/gmp/api/location', locationRoutes);

app.get('/gmp/api/test', (req, res) => res.status(200).json({ message: 'test api' }));

// app.use(unspecifiedRouteHandler);
app.use(finalErrorHandler);

module.exports = app;