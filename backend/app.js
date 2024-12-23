import express from "express"
import dotenv from "dotenv"
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import cors from "cors"
import user from "./controller/user.js"

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "http://localhost:5173", credentials: true,}))
app.use("/", express.static("uploads"))
app.use("/test", (req, res) => {
    res.send("Hello world!");
});
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

if(process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "backend/config/.env" });
}

// Routes
app.use("/api/v2/user", user)

// ErrorHandling
app.use(errorHandler)

export default app