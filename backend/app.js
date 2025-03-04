import express from "express"
import dotenv from "dotenv"
import errorHandler from "./middleware/error.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser"
import cors from "cors"
import user from "./controller/user.js"
import shop from "./controller/shop.js"
import product from "./controller/product.js"
import event from "./controller/event.js"
import coupon from "./controller/couponCode.js"
import payment from "./controller/payment.js"
import order from "./controller/order.js"
import conversation from "./controller/conversation.js"
import message from "./controller/message.js"
import admin from "./controller/admin.js"
import withdraw from "./controller/withdraw.js"

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: "https://prishop-brown.vercel.app", credentials: true,}))
app.use("/", express.static("uploads"))
app.use("/test", (req, res) => {
    res.send("Hello world!");
});
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json({ limit: "100mb" }))

if(process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "backend/config/.env" });
}

// Routes
app.use("/api/v2/user", user)
app.use("/api/v2/shop", shop)
app.use("/api/v2/product", product)
app.use("/api/v2/event", event)
app.use("/api/v2/coupon", coupon)
app.use("/api/v2/payment", payment)
app.use("/api/v2/order", order)
app.use("/api/v2/conversation", conversation)
app.use("/api/v2/message", message)
app.use("/api/v2/admin", admin)
app.use("/api/v2/withdraw", withdraw)

// ErrorHandling
app.use(errorHandler)

export default app