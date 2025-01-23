import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch]);

    const data = orders && orders.find((item) => item._id === id);

    const statusMessages = {
        "Processing": "Your Order is being processed in the shop.",
        "Transferred to delivery partner": "Your Order has been handed out for delivery.",
        "Shipping": "Your Order is on the way with our delivery partner.",
        "Received": "Your Order is in your city. Our Delivery man will deliver it.",
        "On the way": "Your Order has been handed out for delivery.",
        "Delivered": "Your order has been delivered!",
        "Processing refund": "Your refund is being processed!",
        "Refund Successful": "Your refund is successful!",
    };

    return (
        <div className="w-full h-[80vh] flex justify-center items-center">{" "}
            {data?.status && statusMessages[data.status] ? (
                <h1 className="text-[20px]">{statusMessages[data.status]}</h1>
            ) : (
                <h1 className="text-[20px]">Order not found or status unavailable.</h1>
            )}
        </div>
    );
};

export default TrackOrder;