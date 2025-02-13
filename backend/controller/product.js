import express from "express"
import Product from "../model/product.js"
import upload from "../multer.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Shop from "../model/shop.js";
import Order from "../model/order.js"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth.js";
import fs from "fs"
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router();

router.post("/create-product", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
    try {
        const shopId = req.body.shopId;
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return next(new ErrorHandler("Shop Id is invalid!", 400));
        } 

        // Ensure req.files exist
        if (!req.files || req.files.length === 0) {
            return next(new ErrorHandler("Product images are required!", 400));
        }
    
        const imagesLinks = [];
    
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "products",
            });
        
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
    
        const productData = { ...req.body, images: imagesLinks, shop };

        const product = await Product.create(productData);

        res.status(201).json({
            success: true,
            product,
        });
        
        
    } catch (error) {
        return next(new ErrorHandler(error, 400))
    }
}))

// get all products of a shop
router.get("/get-all-products-shop/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find({ shopId: req.params.id });

        res.status(201).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// delete product of a shop
router.delete("/delete-shop-product/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const productId = req.params.id
        const productData = await Product.findById(productId);

        productData.images.forEach((imageUrl) => {
            const filename = imageUrl
            const filePath = `uploads/${filename}`

            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ message: "Error deleting file" })
                }
            })
        })

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            return next(new ErrorHandler("Product is not found with this id", 404));
        }

        res.status(201).json({
            success: true,
            message: "Product Deleted successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// get all products
router.get("/get-all-products", catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            products,
        });
    } catch (error) {
    return next(new ErrorHandler(error, 400));
    }
}));

// review for a product
router.put( "/create-new-review", isAuthenticated, catchAsyncErrors(async (req, res, next) => {
    try {
        const { user, rating, comment, productId, orderId } = req.body;

        const product = await Product.findById(productId);

        const review = { user, rating, comment, productId, };

        const isReviewed = product.reviews.find(
            (rev) => rev.user._id === req.user._id
        );

        if (isReviewed) {
            product.reviews.forEach((rev) => {
                if (rev.user._id === req.user._id) {
                    (rev.rating = rating), (rev.comment = comment), (rev.user = user);
                }
            });
        } else {
            product.reviews.push(review);
        }

        let avg = 0;

        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });

        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        await Order.findByIdAndUpdate(
            orderId,
            { $set: { "cart.$[elem].isReviewed": true } },
            { arrayFilters: [{ "elem._id": productId }], new: true }
        );

        res.status(200).json({
            success: true,
            message: "Review Submitted!",
        });
    } catch (error) {
    return next(new ErrorHandler(error, 400));
    }
}));

// all products --- for admin
router.get("/admin-all-products", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const products = await Product.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

export default router