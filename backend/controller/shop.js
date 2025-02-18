import express from "express"
import ErrorHandler from "../utils/ErrorHandler.js";
import upload from "../multer.js";
import Shop from "../model/shop.js"
import path from "path";
import fs from "fs"
import jwt from "jsonwebtoken"
import sendMail from "../utils/sendMail.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendShopToken from "../utils/shopToken.js";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth.js";
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()

// create shop
router.post("/create-shop", upload.single("avatar"), async (req, res, next) => {
    try {
        const { name, email, phoneNumber } = req.body;
        const avatarFile = req.file

        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            return next(new ErrorHandler("Shop already exists", 400));
        }

        // Check if avatar is provided
        if (!avatarFile) {
            return next(new ErrorHandler("Avatar is required", 400));
        }

        const myCloud = await cloudinary.uploader.upload(avatarFile.path, {
            folder: "avatars",
        });

        const seller = {
            name: name,
            email: email,
            password: req.body.password,
            avatar: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            address: req.body.address,
            phoneNumber: phoneNumber,
            zipCode: req.body.zipCode,
            // subaccountCode,
        };

        const activationToken = createActivationToken(seller);

        const activationUrl = `https://prishop-brown.vercel.app/seller/activation/${activationToken}`;

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
                            <h1>Welcome to PriShop, ${seller.name}!</h1>
                        </div>

                        <!-- Content -->
                        <div class="content">
                            <p>Thank you for registering with PriShop as a seller. To activate your online shop account, please click the button below:</p>
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
                email: seller.email,
                subject: "Activate your online Shop",
                html: emailTemplate,
                isHtml: true,
            });
            res.status(201).json({
                success: true,
                message: `Please check your email:- ${seller.email} to activate your online shop!`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 400));
        }

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// create activation token
const createActivationToken = (seller) => {
    return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
};

// activate shop
router.post("/activation", catchAsyncErrors(async (req, res, next) => {
    try {
        const { activation_token } = req.body;

        const newSeller = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET
        );

        if (!newSeller) {
            return next(new ErrorHandler("Invalid token", 400));
        }
        const { name, email, password, avatar, zipCode, address, phoneNumber } = newSeller;

        let seller = await Shop.findOne({ email });

        if (seller) {
            return next(new ErrorHandler("Shop already exists", 400));
        }

        seller = await Shop.create({ name, email, avatar, password, zipCode, address, phoneNumber,});

        sendShopToken(seller, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// login shop
router.post("/login-shop", catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Please provide the all fields!", 400));
        }

        const seller = await Shop.findOne({ email }).select("+password");

        if (!seller) {
            return next(new ErrorHandler("Seller not found. Please verify your email and password!!", 400));
        }

        const isPasswordValid = await seller.comparePassword(password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("Seller not found. Please verify your email and password!", 400)
            );
        }

        sendShopToken(seller, 201, res);
    } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    }
}));

// load shop
router.get("/getSeller", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.seller._id);

        if (!seller) {
            return next(new ErrorHandler("User doesn't exists", 400));
        }

        res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    }
}));

// log out shop
router.get( "/logout", catchAsyncErrors(async (req, res, next) => {
    try {
        res.cookie("seller_token", null, {
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
}));

// get shop info
router.get( "/get-shop-info/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id);
    res.status(201).json({
        success: true,
        shop,
    });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update shop profile picture
router.put( "/update-shop-avatar", isSeller, upload.single("avatar"), catchAsyncErrors(async (req, res, next) => {
    try {
        let existsSeller = await Shop.findById(req.seller._id);
    
        if (req.body.avatar !== "") {
            const imageId = existsSeller.avatar.public_id;

            await cloudinary.uploader.destroy(imageId);

            const myCloud = await cloudinary.uploader.upload(req.file.path, {
                folder: "avatars",
                width: 150,
            });

            existsSeller.avatar = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        
        await existsSeller.save();

        res.status(200).json({
            success: true,
            seller: existsSeller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update seller info
router.put( "/update-seller-info", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, description, email, address, phoneNumber, zipCode, password } = req.body;

        const shop = await Shop.findOne({ email }).select("+password");

        if (!shop) {
            return next(new ErrorHandler("Shop not found", 400));
        }

        const isPasswordValid = await shop.comparePassword(password);

        if (!isPasswordValid) {
            return next(
                new ErrorHandler("Enter correct password to update shop profile", 400)
            );
        }

        shop.name = name;
        shop.description = description;
        shop.email = email;
        shop.address = address;
        shop.phoneNumber = phoneNumber;
        shop.zipCode = zipCode;

        await shop.save();

        res.status(201).json({
            success: true,
            message: "Profile updated successfully!",
            shop,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// all sellers --- for admin
router.get("/admin-all-sellers", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const sellers = await Shop.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            sellers,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

 // delete seller ---admin
router.delete( "/delete-seller/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.params.id);

        if (!seller) {
            return next(
                new ErrorHandler("Seller is not available with this id", 400)
            );
        }

        await Shop.findByIdAndDelete(req.params.id);

        res.status(201).json({
            success: true,
            message: "Seller deleted successfully!",
        });
    } catch (error) {
    return next(new ErrorHandler(error.message, 500));
    }
}));

// update seller withdraw methods --- sellers
router.put("/update-payment-methods", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const { withdrawMethod } = req.body;

        const seller = await Shop.findByIdAndUpdate(req.seller._id, {
            withdrawMethod,
        });

        res.status(201).json({
            success: true,
            seller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

  // delete seller withdraw merthods --- only seller
router.delete( "/delete-withdraw-method/", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const seller = await Shop.findById(req.seller._id);

        if (!seller) {
            return next(new ErrorHandler("Seller not found with this id", 400));
        }

        seller.paystackRecipientCode = undefined;
        seller.withdrawMethod = undefined; // Clear withdraw method

        await seller.save();

        res.status(201).json({
            success: true,
            seller,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

export default router