import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import PriShopLogo from "../../assets/logo/PriShopLogo.png"
import styles from "../../styles/styles"
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik"
import { signInSchema } from "../../yup/validationSchema";
import { FiLoader } from "react-icons/fi"
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";

const Login = () => {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false);

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: signInSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await axios.post(
                    `${server}/user/login-user`,
                    {
                        email: values.email,
                        password: values.password,
                    },
                    { withCredentials: true }
                );
                
                if (res.data.success === true) {
                    toast.success("Login Successful!");
                    navigate("/");
                    window.location.reload(true);
                }
                
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setSubmitting(false);
            }
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center">
                <img src={PriShopLogo} alt="logo" className="w-[150px] text-center"/>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Log in to your account</h2>
                <h2 className="text-sm mt-1 text-gray-400">Welcome back! Please enter your details.</h2>
            </div>
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-7 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input type="email" name="email" autoComplete="email" placeholder="Enter your email" value={values.email} onChange={handleChange} onBlur={handleBlur} className={errors.email && touched.email ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            {errors.email && touched.email && <p className='flex text-xs text-red-600 font-semibold'>{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input type={visible ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={handleChange} onBlur={handleBlur} className={errors.password && touched.password ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                                {visible ? (<AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(false)} />) : (<AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(true)}/>)}

                                {errors.password && touched.password && <p className='flex text-xs text-red-500 font-semibold'>{errors.password}</p>}
                            </div>
                        </div>

                        <div className={`${styles.normalFlex} justify-between`}>
                            <div className={`${styles.normalFlex}`}>
                                <input type="checkbox" name="remember-me" id="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href=".forgot-password" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting ? <FiLoader className="animate-spin" /> : "Sign In"}
                            </button>
                        </div>
                        <div className={`${styles.normalFlex} w-full text-sm justify-center`}>
                            <h4>Don&apos;t have any account?</h4>
                            <Link to="/sign-up" className="text-blue-600 pl-2 hover:underline">
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login