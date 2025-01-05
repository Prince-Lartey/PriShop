import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your shop name!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your shop email address"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false,
    },
    description: {
        type: String,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    role: {
        type: String,
        default: "Seller",
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    zipCode: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
})

// Hash password
shopSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
shopSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// compare password
shopSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Shop = mongoose.model("Shop", userSchema)

export default Shop