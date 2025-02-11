import app from "./app.js"
import dotenv from "dotenv"
import connection from "./db/database.js";
import { v2 as cloudinary } from 'cloudinary'

const PORT = process.env.PORT || 8000

// Handling uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "config/.env" });
}

// Connect to DB
connection()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// create server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`);
    console.log(`shutting down the server for unhandle promise rejection`);

    server.close(() => {
        process.exit(1);
    });
});