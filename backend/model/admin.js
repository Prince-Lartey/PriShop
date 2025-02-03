import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Please enter your email!"],
    },
    password:{
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    role:{
        type: String,
        default: "admin",
    },
});

//  Hash password
adminSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});

// jwt token
adminSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES,
    });
};

// compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema)

export default Admin