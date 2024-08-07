require('dotenv').config();
const PORT = process.env.PORT;
const connectToDB = require("./config/db");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

// const unspecifiedRouteHandler = require('./routes/unspecifiedRouteHandler.js');
//const { finalErrorHandler } = require('./errorHandler/apiErrorHandler');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const locationRoutes = require('./routes/locationRoutes');
// const venderRoute = require('./routes/venderRoutes');

app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/gmp/file', express.static("public/property_files"));
app.use('/gmp/image', express.static("public/images"));

app.use('/gmp/api/admin', adminRoutes);
// app.use('/gmp/api/vender', venderRoute);
app.use('/gmp/api/user', userRoutes);
app.use('/gmp/api/location', locationRoutes);

app.get('/gmp/api/test', (req, res) => res.status(200).json({ message: 'test api' }));

// app.use(unspecifiedRouteHandler);
//app.use(finalErrorHandler);

const initialiseServer = async () => {
    try {
        await connectToDB()
        app.listen(PORT, () => console.log(`Server is runing on ${PORT}`));
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

initialiseServer();
