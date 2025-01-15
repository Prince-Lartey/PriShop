import express from "express"
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../model/user.js";
import upload from "../multer.js";
import path from "path";
import fs from "fs"
import jwt from "jsonwebtoken"
import sendMail from "../utils/sendMail.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/jwtToken.js";
import { isAuthenticated } from "../middleware/auth.js"

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

        const activationUrl = `http://localhost:5173/activation/${activationToken}`

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                message: `Hello ${user.name}, please click on the link to activate your account: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email to activate your account!`,
            });

        } catch (error) {
            return next(new ErrorHandler(error.message, 500))
        }

    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// create activation token
const createActivationToken = (user) => {
    return jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
}; 

// User activation
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        const newUser = jwt.verify(activation_token, process.env.ACTIVATION_SECRET);

        if (!newUser) {
            return next(new ErrorHandler("Invalid token", 400));
        }

        const { name, email, password, avatar } = newUser;

        let user = await User.findOne({ email });

        if (user) {
            return next(new ErrorHandler("User already exists", 400));
        }
        user = await User.create({
            name,
            email,
            avatar,
            password,
        });

        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// login user
router.post("/login-user", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found. Please verify your email and password!", 400));
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("User not found. Please verify your email and password!", 400)
            );
        }

        sendToken(user, 201, res)

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// load user
router.get("/getuser", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return next(new ErrorHandler("User doesn't exist", 400));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
    })
);

// log out user
router.get( "/logout", catchAsyncErrors(async (req, res, next) => {
        try {
            res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            res.status(201).json({
                success: true,
                message: "Log out successful!",
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
    })
);

// update user info
router.put("/update-user-info", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password, phoneNumber, name } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("Enter correct password to update profile", 400)
            );
        }

        user.name = name;
        user.email = email;
        user.phoneNumber = phoneNumber;

        await user.save();

        res.status(201).json({
            success: true,
            message: "Profile updated successfully!",
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update user avatar
router.put("/update-avatar", isAuthenticated, upload.single("image"), catchAsyncErrors(async (req, res, next) => {
    try {
        const existsUser = await User.findById(req.user.id);

        const existAvatarPath = `uploads/${existsUser.avatar}`

        if (fs.existsSync(existAvatarPath)) {
            fs.unlinkSync(existAvatarPath);
        }

        const fileUrl = req.file.filename

        const user = await User.findByIdAndUpdate(req.user.id, {avatar: {
            url: fileUrl,
            public_id: null
        }})

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update user addresses
router.put("/update-user-addresses", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        const sameTypeAddress = user.addresses.find(
            (address) => address.addressType === req.body.addressType
        );
        if (sameTypeAddress) {
            return next(
                new ErrorHandler(`${req.body.addressType} address already exists`)
            );    
        }

        const existsAddress = user.addresses.find(
            (address) => address._id === req.body._id
        );

        if (existsAddress) {
            Object.assign(existsAddress, req.body);
        } else {
          // add the new address to the array
            user.addresses.push(req.body);
        }

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

export default router