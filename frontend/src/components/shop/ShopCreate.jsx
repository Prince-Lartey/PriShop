
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import PriShopLogo from "../../assets/logo/PriShopLogo.png"
import styles from "../../styles/styles"
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik"
import { registerShopSchema } from "../../yup/validationSchema";
import { FiLoader } from "react-icons/fi"
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";
import { RxAvatar } from "react-icons/rx";

const ShopCreate = () => {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            avatar: "",
            zipCode: "00000",
            address: "",
            phoneNumber: "",
        },
        validationSchema: registerShopSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // Prepare form data for submission
                const formData = new FormData();
                formData.append("name", values.name);
                formData.append("email", values.email);
                formData.append("password", values.password);
                formData.append("avatar", values.avatar);
                formData.append("zipCode", values.zipCode);
                formData.append("address", values.address);
                formData.append("phoneNumber", values.phoneNumber);

                // Send POST request
                const res = await axios.post(`${server}/shop/create-shop`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (res.data.success === true) {
                    toast.success(res.data.message)
                    resetForm();
                    setAvatarPreview(null);
                    navigate("/shop-login")
                }
            }
            catch (error) {
               // Handle errors from the backend
                toast.error(error.response.data.message)
            } 
            finally {
                setSubmitting(false);
            }
        }
    })

    // Handle file change for the avatar
    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFieldValue("avatar", file); // Store the file in Formik
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert the file to a Base64 string for preview
            reader.onloadend = () => {
                setAvatarPreview(reader.result); // Update preview state
            };
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center justify-center">
                <img src={PriShopLogo} alt="logo" className="w-[150px] text-center"/>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">Register as a Seller</h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[35rem]">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Shop Name</label>
                            <input type="name" name="name" placeholder="Enter your shop name" value={values.name} onChange={handleChange} onBlur={handleBlur} className={errors.name && touched.name ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            {errors.name && touched.name && <p className='flex text-xs text-red-600 font-semibold'>{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number (Should be same as your Mobile Money number)</label>
                            <input type="number" name="phoneNumber" autoComplete="phoneNumber" placeholder="Enter your Phone number" value={values.phoneNumber} onChange={handleChange} onBlur={handleBlur} className={errors.phoneNumber && touched.phoneNumber ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            {errors.phoneNumber && touched.phoneNumber && <p className='flex text-xs text-red-600 font-semibold'>{errors.phoneNumber}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input type="email" name="email" autoComplete="email" placeholder="Enter your email" value={values.email} onChange={handleChange} onBlur={handleBlur} className={errors.email && touched.email ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            {errors.email && touched.email && <p className='flex text-xs text-red-600 font-semibold'>{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="address" name="address" autoComplete="address" placeholder="Enter your address" value={values.address} onChange={handleChange} onBlur={handleBlur} className={errors.address && touched.address ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            {errors.address && touched.address && <p className='flex text-xs text-red-600 font-semibold'>{errors.address}</p>}
                        </div>

                        <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZipCode</label>
                            <input type="number" name="zipCode" autoComplete="zipCode" placeholder="Enter your zipcode" value={values.zipCode} onChange={handleChange} onBlur={handleBlur} className={errors.zipCode && touched.zipCode ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                            {errors.zipCode && touched.zipCode && <p className='flex text-xs text-red-600 font-semibold'>{errors.zipCode}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative">
                                <input type={visible ? "text" : "password"} name="password" autoComplete="current-password" placeholder="Enter your password" value={values.password} onChange={handleChange} onBlur={handleBlur} className={errors.password && touched.password ? "appearance-none block w-full px-3 py-2 border border-red-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" : "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"}/>
                                {visible ? (<AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(false)} />) : (<AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(true)}/>)}

                                {errors.password && touched.password && <p className='flex text-xs text-red-500 font-semibold'>{errors.password}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700"></label>
                            <div className="mt-2 flex items-center">
                                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                                    {avatarPreview ? (<img src={avatarPreview} alt="avatar" className="h-full w-full object-cover rounded-full"/>) : (<RxAvatar className="h-8 w-8" />)}
                                </span>
                                <label htmlFor="file-input" className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100">
                                    <span className="cursor-pointer">Upload an image</span>
                                    <input type="file" name="avatar" id="file-input" accept=".jpg,.jpeg,.png" onChange={handleFileInputChange} className="sr-only"/>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                                {isSubmitting ? <FiLoader className="animate-spin" /> : "Submit"}
                            </button>
                        </div>
                        <div className={`${styles.normalFlex} w-full text-sm justify-center`}>
                            <h4>Already have an account?</h4>
                            <Link to="/shop-login" className="text-blue-600 pl-2 hover:underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ShopCreate