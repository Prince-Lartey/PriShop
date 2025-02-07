import express from "express"
import ErrorHandler from "../utils/ErrorHandler.js";
import Shop from "../model/shop.js"
import sendMail from "../utils/sendMail.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Withdraw from "../model/withdraw.js"
import { isAdmin, isAuthenticated, isSeller } from "../middleware/auth.js"
import axios from "axios";

const router = express.Router()

// Helper function to interact with Paystack API
const paystackRequest = async (url, method, data = {}) => {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    const config = {
        method,
        url: `https://api.paystack.co/${url}`,
        headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
        },
        data,
    };

    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Paystack API request failed");
    }
};

router.post("/create-recipient", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, mobileNumber, networkProvider } = req.body;

        const recipientData = {
            type: "mobile_money",
            name,
            account_number: mobileNumber,
            bank_code: networkProvider, // Use network provider as bank_code for mobile money
            currency: "GHS",
        };

        const paystackResponse = await paystackRequest("transferrecipient", "POST", recipientData);

        if (paystackResponse.status) {
            // Save the recipient code to the seller's profile
            const shop = await Shop.findById(req.seller._id);
            shop.paystackRecipientCode = paystackResponse.data.recipient_code;
            shop.withdrawMethod = { networkProvider, mobileNumber };
            await shop.save();

            res.status(201).json({
                success: true,
                recipient: paystackResponse.data,
            });
        } else {
            return next(new ErrorHandler(paystackResponse.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// create withdraw request --- only for seller
router.post("/create-withdraw-request", isSeller, catchAsyncErrors(async (req, res, next) => {
    try {
        const { amount } = req.body;

        // Validate the amount
        if (amount < 50) {
            return next(new ErrorHandler("Minimum withdrawal amount is 50 GHS", 400));
        }

        // Check if the seller has enough balance
        const shop = await Shop.findById(req.seller._id);
        if (shop.availableBalance < amount) {
            return next(new ErrorHandler("Insufficient balance", 400));
        }

        // Prepare the Paystack transfer request
        const transferData = {
            source: "balance",
            amount: amount * 100, // Convert to pesewas
            recipient: shop.paystackRecipientCode, // Use the saved recipient code
            reason: "Withdrawal request",
        };

        // Initiate the transfer using Paystack API
        const paystackResponse = await paystackRequest("transfer", "POST", transferData);

        if (paystackResponse.status) {
            // Create a withdrawal record
            const withdraw = await Withdraw.create({
                seller: req.seller,
                amount,
                transactionId: paystackResponse.data.id,
            });

            // Update the seller's available balance
            shop.availableBalance = shop.availableBalance - amount;
            await shop.save();

            // Send email notification
            await sendMail({
                email: req.seller.email,
                subject: "Withdraw Request",
                message: `Hello ${req.seller.name}, Your withdrawal request of GH₵ ${amount} is being processed.`,
            });

            res.status(201).json({
                success: true,
                withdraw,
            });
        } else {
            return next(new ErrorHandler(paystackResponse.message, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// get all withdraws --- admnin

router.get("/get-all-withdraw-request", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const withdraws = await Withdraw.find().sort({ createdAt: -1 });

        res.status(201).json({
            success: true,
            withdraws,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

// update withdraw request ---- admin
router.put("/update-withdraw-request/:id", isAuthenticated, isAdmin("Admin"), catchAsyncErrors(async (req, res, next) => {
    try {
        const { sellerId } = req.body;

        const withdraw = await Withdraw.findByIdAndUpdate(
            req.params.id,
            {
                status: "Approved",
                updatedAt: Date.now(),
            },
            { new: true }
        );

        const seller = await Shop.findById(sellerId);

        const transection = {
            _id: withdraw._id,
            amount: withdraw.amount,
            updatedAt: withdraw.updatedAt,
            status: withdraw.status,
        };

        seller.transections = [...seller.transections, transection];

        await seller.save();

        try {
            await sendMail({
                email: seller.email,
                subject: "Payment confirmation",
                message: `Hello ${seller.name}, Your withdraw request of GH₵ ${withdraw.amount} is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
            });
        } catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
        res.status(201).json({
            success: true,
            withdraw,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}));

export default router