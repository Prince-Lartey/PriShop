import express from "express"
import dotenv from "dotenv"
import ErrorHandler from "./utils/ErrorHandler.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import fileUpload from "express-fileupload";

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use("/test", (req, res) => {
    res.send("Hello world!");
});
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload({useTempFiles: true}))

if(process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "backend/config/.env" });
}

// ErrorHandling
app.use(ErrorHandler)

export default app