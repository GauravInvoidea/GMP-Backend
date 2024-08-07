require('dotenv').config();
const PORT = process.env.PORT;
const app = require('./app');
const connectToDB = require("./config/db");

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