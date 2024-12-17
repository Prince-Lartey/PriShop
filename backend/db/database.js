import mongoose from "mongoose"

const connection = () => {
    mongoose.connect(process.env.DB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then((data) => {
        console.log(`mongodb connected with server: ${data.connection.host}`);
    })
    .catch((error) => {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit on connection error
    });
};

export default connection