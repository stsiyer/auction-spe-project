const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        // URL encode the connection string
        const encodedConnectionString = encodeURIComponent(process.env.CONNECTION_STRING);
        
        // Connect to the database using the encoded connection string
        const connect = await mongoose.connect(decodeURIComponent(encodedConnectionString));
        
        console.log("Database connected: ", connect.connection.host, connect.connection.name);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

module.exports = connectDb;
