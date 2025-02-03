import * as yup from "yup"

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

export const registerSchema = yup.object({
    fullName: yup.string().trim().min(4, "Full name must be at least 4 characters").required("Full name is required"),
    email: yup.string().trim().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().trim().min(8, "Password must not be less than 8 characters").matches(passwordRules, { message: "Provide a stronger password" }).required("Password is required"),
})

export const signInSchema = yup.object({
    email: yup.string().trim().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().trim().required("Password is required"),
})

export const registerShopSchema = yup.object({
    name: yup.string().trim().min(4, "Shop name must be at least 4 characters").required("Shop name is required"),
    email: yup.string().trim().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().trim().min(8, "Password must not be less than 8 characters").matches(passwordRules, { message: "Provide a stronger password" }).required("Password is required"),
    phoneNumber: yup.string().trim().matches(/^\+?[0-9]{10,15}$/, "Phone number must be valid with 10-15 digits").required("Phone number is required"),
    address: yup.string().trim().min(10, "Address must be at least 10 characters long").required("Address is required"),
    zipCode: yup.string().trim().matches(/^\d{4,10}$/, "Zip code must be a valid format").required("Zip code is required"),
})

export const signInShopSchema = yup.object({
    email: yup.string().trim().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().trim().required("Password is required"),
})

export const adminRegisterSchema = yup.object({
    email: yup.string().trim().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().trim().min(8, "Password must not be less than 8 characters").matches(passwordRules, { message: "Provide a stronger password" }).required("Password is required"),
})
