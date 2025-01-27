import express from "express"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Event from "../model/event.js";
import Shop from "../model/shop.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import upload from "../multer.js";
import { isSeller } from "../middleware/auth.js";
import fs from "fs"

const router = express.Router()

// create event
router.post("/create-event", upload.array("images"), catchAsyncErrors(async (req, res, next) => {
        try {
            const shopId = req.body.shopId;
            const shop = await Shop.findById(shopId);
            if (!shop) {
                return next(new ErrorHandler("Shop Id is invalid!", 400));
            } else {
                const files = req.files
                const imageUrls = files.map((file) => `${file.filename}`)
                const eventData = req.body;
                eventData.images = imageUrls;
                eventData.shop = shop;
    
                const event = await Event.create(eventData);
        
                res.status(201).json({
                    success: true,
                    event,
                });
            }
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

// delete product of a shop
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

export default router