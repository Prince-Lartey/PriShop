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
router.post("/create-user", async (req, res, next) => {  

    try {
        const { name, email, password, avatar } = req.body;
        const userEmail = await User.findOne({ email });

        if (userEmail) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const myCloud = await cloudinary.uploader.upload(avatar, {
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