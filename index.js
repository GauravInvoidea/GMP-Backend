require('dotenv').config();
const PORT = process.env.PORT;
const app = require('./src/app');
const connectToDB = require("./src/config/db");

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