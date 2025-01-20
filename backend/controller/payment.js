import express from "express"
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import axios from "axios";

const router = express.Router();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Helper function to interact with Paystack API
const paystackRequest = async (url, method, data = {}) => {
    const config = {
        method,
        url: `https://api.paystack.co/${url}`,
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        data,
    };
    const response = await axios(config);
    return response.data;
};

// Route to initialize a payment
router.post("/process", catchAsyncErrors(async (req, res, next) => {
    const { amount, email } = req.body;

    if (!amount || !email) {
        return res.status(400).json({
            success: false,
            message: "Amount and email are required.",
        });
    }

    const paymentData = {
        amount: amount * 100,
        email, 
        currency: "GHS", 
        metadata: {
            company: "PriShop",
        },
    };

    // Create a payment initialization request
    const paymentResponse = await paystackRequest("transaction/initialize", "POST", paymentData);

    res.status(201).json({
        success: true,
        authorization_url: paymentResponse.data.authorization_url, // Redirect user to this URL for payment
        reference: paymentResponse.data.reference, // Use this reference to verify payment
    });
}));

// Route to fetch the Paystack public key
router.get("/paystackapikey", catchAsyncErrors(async (req, res, next) => {
    res.status(200).json({ paystackApiKey: process.env.PAYSTACK_PUBLIC_KEY });
}));

export default router