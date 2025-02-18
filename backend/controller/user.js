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
import { isAdmin, isAuthenticated } from "../middleware/auth.js"
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()

// create user
router.post("/create-user", upload.single("avatar"), async (req, res, next) => {  

    try {
        const { name, email, password } = req.body;
        const avatarFile = req.file
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            return next(new ErrorHandler("User already exists", 400));
        }

        // Check if avatar is provided
        if (!avatarFile) {
            return next(new ErrorHandler("Avatar is required", 400));
        }

        const myCloud = await cloudinary.uploader.upload(avatarFile.path, {
            folder: "avatars",
        });

        const user = {
            name: name,
            email: email,
            password: password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        }

        const activationToken = createActivationToken(user);

        const activationUrl = `https://prishop-brown.vercel.app/activation/${activationToken}`

        const emailTemplate = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Account Activation</title>
                    <style>
                        /* General Reset */
                        body, html {
                            margin: 0;
                            padding: 0;
                            font-family: 'Arial', sans-serif;
                            background-color: #f9f9f9;
                            color: #333333;
                            line-height: 1.6;
                        }

                        /* Outer Container */
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border: 1px solid #e0e0e0;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                        }

                        /* Header */
                        .header {
                            text-align: center;
                            padding-bottom: 20px;
                            border-bottom: 1px solid #e0e0e0;
                        }

                        .header h1 {
                            font-size: 24px;
                            color: #333333;
                            margin: 0;
                        }

                        /* Content */
                        .content {
                            padding: 20px 0;
                        }

                        .content p {
                            font-size: 16px;
                            color: #555555;
                            margin: 0 0 20px 0;
                        }

                        /* Button */
                        .button-container {
                            text-align: center;
                            margin: 20px 0;
                        }

                        .button {
                            display: inline-block;
                            padding: 12px 24px;
                            font-size: 16px;
                            color: #ffffff;
                            background-color: #007bff;
                            border-radius: 5px;
                            text-decoration: none;
                            transition: background-color 0.3s ease;
                        }

                        .button:hover {
                            background-color: #0056b3;
                        }

                        /* Footer */
                        .footer {
                            text-align: center;
                            padding-top: 20px;
                            border-top: 1px solid #e0e0e0;
                            font-size: 14px;
                            color: #888888;
                        }

                        .footer p {
                            margin: 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <!-- Header -->
                        <div class="header">
                            <h1>Welcome to PriShop, ${user.name}!</h1>
                        </div>

                        <!-- Content -->
                        <div class="content">
                            <p>Thank you for registering with PriShop. To activate your account, please click the button below:</p>
                            <div class="button-container">
                                <a href="${activationUrl}" class="button">Activate Your Account</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="footer">
                            <p>If you did not sign up for this account, please ignore this email.</p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        try {
            await sendMail({
                email: user.email,
                subject: "Activate your account",
                html: emailTemplate,
                isHtml: true,
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
router.put("/update-avatar", isAuthenticated, upload.single("avatar"), catchAsyncErrors(async (req, res, next) => {
    try {
        let existsUser = await User.findById(req.user.id);
        if (req.body.avatar !== "") {
            const imageId = existsUser.avatar.public_id;

            await cloudinary.uploader.destroy(imageId);

            const myCloud = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                width: 150,
            });

            existsUser.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        await existsUser.save();

        res.status(200).json({
            success: true,
            user: existsUser,
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

// delete user address
router.delete("/delete-user-address/:id", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const userId = req.user._id;
        const addressId = req.params.id;

        await User.updateOne(
            { _id: userId, },
            { $pull: { addresses: { _id: addressId } } }
        );

        const user = await User.findById(userId);

        res.status(200).json({ success: true, user });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}))

// update user password
router.put( "/update-user-password", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("+password");

        const isPasswordMatched = await user.comparePassword(
            req.body.oldPassword
        );

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect!", 400));
        }

        // Ensure new password is not the same as the old password
        const isSamePassword = await user.comparePassword(req.body.newPassword);
        if (isSamePassword) {
            return next(new ErrorHandler("New password cannot be the same as the old password!", 400));
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(
                new ErrorHandler("Passwords do not match!", 400)
            );
        }
        user.password = req.body.newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// find user infoormation with the userId
router.get( "/user-info/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// all users --- for admin
router.get( "/admin-all-users", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const users = await User.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            users,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

  // delete users --- admin
router.delete( "/delete-user/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(
                new ErrorHandler("User is not available with this id", 400)
            );
        }

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        await User.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: "User deleted successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));


export default router