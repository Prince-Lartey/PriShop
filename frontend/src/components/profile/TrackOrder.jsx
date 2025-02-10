import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { motion } from "framer-motion";
import { FaTruck, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { BsArrowRepeat } from "react-icons/bs";
import Confetti from "react-confetti";

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch]);

    const data = orders && orders.find((item) => item._id === id);

    const statusComponents = {
        "Processing": (
            <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="flex flex-col items-center"
            >
                <FaSpinner className="text-blue-500 text-[100px] animate-spin" />
                <h1 className="text-[20px] mt-2">Your order is being processed.</h1>
            </motion.div>
        ),
        "Transferred to delivery partner": (
            <motion.div 
                initial={{ x: -200, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center"
            >
                <FaTruck className="text-green-500 text-[100px]" />
                <h1 className="text-[20px] mt-2">Your order has been handed out for delivery.</h1>
            </motion.div>
        ),
        "Delivered": (
            <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1, rotate: 360 }} 
                transition={{ type: "spring", stiffness: 120, damping: 10 }}
                className="flex flex-col items-center"
            >
                <FaCheckCircle className="text-green-600 text-[100px]" />
                <h1 className="text-[20px] mt-2">Your order has been delivered!</h1>
            </motion.div>
        ),
        "Processing refund": (
            <motion.div 
                initial={{ rotate: 0 }} 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="flex flex-col items-center"
            >
                <BsArrowRepeat className="text-yellow-500 text-[100px]" />
                <h1 className="text-[20px] mt-2">Your refund is being processed!</h1>
            </motion.div>
        ),
        "Refund Successful": (
            <div className="flex flex-col items-center">
                <Confetti numberOfPieces={100} recycle={false} />
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.5 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.5 }}
                    className="text-[20px] text-green-500 font-bold"
                >
                    🎉 Your refund is successful! 🎉
                </motion.h1>
            </div>
        ),
    };

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">{" "}
            {data?.status ? statusComponents[data.status] || <h1 className="text-[20px]">Unknown status.</h1> : (
                <h1 className="text-[20px]">Order not found or status unavailable.</h1>
            )}
        </div>
    );
};

export default TrackOrder;