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
import { isSeller } from "../middleware/auth.js";

const router = express.Router()

// create shop
router.post("/create-shop", upload.single("file"), async (req, res, next) => {
    try {
        const { name, email, phoneNumber } = req.body;

        const sellerEmail = await Shop.findOne({ email });
        if (sellerEmail) {
            const filename = req.file.filename
            const filePath = `uploads/${filename}`
            fs.unlink(filePath, (error) => {
                if (error) {
                    res.status(500).json({ message: "Error deleting file" })
                }
            })
            
            return next(new ErrorHandler("Shop already exists", 400));
        }

        const filename = req.file.filename
        const fileUrl = path.join(filename)

        // Create subaccount on Paystack
        // let subaccountCode;
        // try {
        //     const subaccountResponse = await createSubaccount({
        //         name,
        //         email,
        //         phoneNumber,
        //     });
        //     subaccountCode = subaccountResponse.subaccount_code; // Extract subaccount code from Paystack response
        // } catch (error) {
        //     return next(new ErrorHandler("Error creating subaccount: " + error.message, 500));
        // }

        const seller = {
            name: name,
            email: email,
            password: req.body.password,
            avatar: {
                url: fileUrl,
                public_id: null
            },
            address: req.body.address,
            phoneNumber: phoneNumber,
            zipCode: req.body.zipCode,
            // subaccountCode,
        };

        const activationToken = createActivationToken(seller);

        const activationUrl = `http://localhost:5173/seller/activation/${activationToken}`;

        try {
            await sendMail({
                email: seller.email,
                subject: "Activate your online Shop",
                message: `Hello ${seller.name}, please click on the link to activate your online shop: ${activationUrl}`,
            });
            res.status(201).json({
                success: true,
                message: `please check your email:- ${seller.email} to activate your online shop!`,
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
router.put( "/update-shop-avatar", isSeller, upload.single("image"), catchAsyncErrors(async (req, res, next) => {
    try {
        let existsSeller = await Shop.findById(req.seller._id);
    
            const existAvatarPath = `uploads/${existsSeller.avatar}`

            if (fs.existsSync(existAvatarPath)) {
                fs.unlinkSync(existAvatarPath);
            }

            const fileUrl = req.file.filename

            const seller = await Shop.findByIdAndUpdate(req.seller._id, {avatar: {
                url: fileUrl,
                public_id: null
            }})
        
            await existsSeller.save();
    
            res.status(200).json({
                success: true,
                seller,
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

export default router