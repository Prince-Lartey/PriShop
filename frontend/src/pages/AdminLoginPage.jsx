import PriShopLogo from "../assets/logo/PriShopLogo.png"
import styles from "../styles/styles"
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"
import { FiLoader } from "react-icons/fi"
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../server";

const AdminLoginPage = () => {
    const navigate = useNavigate()

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await axios.post(
                    `${server}/admin/login-admin`,
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
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Log in to your admin account</h2>
            </div>
            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-7 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input type="email" name="email" autoComplete="email" placeholder="Enter your email" value={values.email} onChange={handleChange} onBlur={handleBlur} className={errors.email && touched.email ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input type="password" name="password" autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={handleChange} onBlur={handleBlur} className={errors.password && touched.password ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            </div>
                        </div>

                        <div className={`${styles.normalFlex} justify-between`}>
                            <div className={`${styles.normalFlex}`}>
                                <input type="checkbox" name="remember-me" id="remember-me" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting ? <FiLoader className="animate-spin" /> : "Sign In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLoginPage