import * as yup from "yup"

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

export const registerSchema = yup.object({
    fullName: yup.string().min(4, "Full name must be at least 4 characters").required("Full name is required"),
    email: yup.string().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().min(8, "Password must not be less than 8 characters").matches(passwordRules, { message: "Provide a stronger password" }).required("Password is required"),
})

export const signInSchema = yup.object({
    email: yup.string().email("Email must be a valid email address").required("A valid email is required"),
    password: yup.string().required("Password is required"),
})