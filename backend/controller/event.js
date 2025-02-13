import express from "express"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Event from "../model/event.js";
import Shop from "../model/shop.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import upload from "../multer.js";
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth.js";
import fs from "fs"
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()

// create event
router.post("/create-event", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
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

            const eventData = { ...req.body, images: imagesLinks, shop };

            const event = await Event.create(eventData);
    
            res.status(201).json({
                success: true,
                event,
            });
            
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    })
);

// get all events
router.get("/get-all-events", async (req, res, next) => {
    try {
        const events = await Event.find();
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

// get all events of a shop
router.get("/get-all-events/:id", catchAsyncErrors(async (req, res, next) => {
    try {
        const events = await Event.find({ shopId: req.params.id });

        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// delete event of a shop
router.delete("/delete-shop-event/:id", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const eventId = req.params.id
        const eventData = await Event.findById(eventId);

        eventData.images.forEach((imageUrl) => {
            const filename = imageUrl
            const filePath = `uploads/${filename}`

            fs.unlink(filePath, (error) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({ message: "Error deleting file" })
                }
            })
        })

        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return next(new ErrorHandler("Event is not found with this id", 404));
        }

        res.status(201).json({
            success: true,
            message: "Event Deleted successfully!",
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
}));

// all events --- for admin
router.get( "/admin-all-events", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const events = await Event.find().sort({ createdAt: -1,});
        res.status(201).json({
            success: true,
            events,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

export default router