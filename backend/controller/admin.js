import express from "express"
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import adminToken from "../utils/AdminToken.js";
import { isAdmin } from "../middleware/auth.js"
import Admin from "../model/admin.js";

const router = express.Router()

// create admin
router.post("/create-admin", async (req, res, next) => {  

    try {
        const { email, password } = req.body;
        const adminEmail = await Admin.findOne({ email });

        if (adminEmail) {
            return next(new ErrorHandler("Admin already exists", 400));
        }

        await Admin.create({
            email,
            password,
        });

        adminToken(user, 201, res);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// login admin
router.post("/login-admin", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await Admin.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Wrong Credentials. Please verify your email and password!", 400));
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("Wrong Credentials. Please verify your email and password!", 400)
            );
        }

        adminToken(user, 201, res)

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

export default router