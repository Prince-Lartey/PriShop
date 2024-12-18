import express from "express"
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../model/user.js";
import upload from "../multer.js";
import path from "path";
import fs from "fs"
import jwt from "jsonwebtoken"

const router = express.Router()

// create user
router.post("/create-user", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            const filename = req.file.filename
            const filePath = `uploads/${filename}`
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ message: "Error deleting file" })
                }else {
                    res.json({ message: "File deleted successfully!" })
                }
            })
            
            return next(new ErrorHandler("User already exists", 400));
        }

        const filename = req.file.filename
        const fileUrl = path.join(filename)
        const user = {
            name: name,
            email: email,
            password: password,
            avatar: {
                url: fileUrl,
                public_id: null
            }
        }

        const activationToken = createActivationToken(user);

        const activationUrl = `http:localhost:3000/activation/${activationToken}`

        try {
            
        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }

    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }

    // create activation token
    const createActivationToken = (user) => {
        return jwt.sign(user, process.env.ACTIVATION_SECRET, {
            expiresIn: "5m",
        });
    };    
})

export default router