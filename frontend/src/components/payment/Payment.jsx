import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';
import { toast } from 'react-toastify';
import axios from 'axios';
import { server } from '../../server';

const Payment = () => {
    const [orderData, setOrderData] = useState([]);
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [paystackPublicKey, setPaystackPublicKey] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        async function getPaystackPublicKey() {
            const { data } = await axios.get(`${server}/payment/paystackapikey`);
            setPaystackPublicKey(data.paystackApiKey);
        }
        getPaystackPublicKey();
    }, []);

    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem("latestOrder"));
        setOrderData(orderData);
    }, [])

    const order = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user: user && user,
        totalPrice: orderData?.totalPrice,
    };

    const paymentHandler = async (e) => {
        e.preventDefault();
    
        try {

            const { data } = await axios.post(`${server}/payment/process`, {
                amount: orderData?.totalPrice,
                email: user?.email,
            });

            console.log("Payment Initialization Response:", data);
    
            if (data.success) {
                const handler = window.PaystackPop.setup({
                    key: paystackPublicKey,
                    email: user?.email,
                    amount: orderData?.totalPrice * 100,
                    currency: "GHS",
                    ref: data.reference, // Use the backend-generated reference
                    callback:  (response) => {

                        processOrder(response.reference)
    
                        // Optionally verify the payment with the backend
                    },
                    onClose: () => {
                        toast.error("Transaction was not completed, payment window closed.");
                    },
                });
    
                handler.openIframe();
            }
        } catch (error) {
            console.error("Payment error:", error)
            toast.error(error.response?.data?.message || "An error occurred during payment.");
        }
    };

    // Function to handle asynchronous order creation
const processOrder = async (reference) => {
    try {
        // Attach payment info to the order object
        order.paymentInfo = {
            id: reference,
            status: "Succeeded",
            type: "Paystack",
        };

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        // Create the order
        await axios.post(`${server}/order/create-order`, order, config);

        navigate("/order/success");
        toast.success("Order successful!");

        // Clear local storage
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));

        window.location.reload();
    } catch (error) {
        toast.error(
            error.response?.data?.message || "Order creation failed."
        );
    }
};

    const cashOnDeliveryHandler = (e) => {
        e.preventDefault()
    }

    return (
        <div className="w-full flex flex-col items-center py-8">
            <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
                <div className="w-full 800px:w-[65%]">
                    <PaymentInfo user={user} paymentHandler={paymentHandler} open={open} setOpen={setOpen} cashOnDeliveryHandler={cashOnDeliveryHandler} />
                </div>

                <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
                    <CartData orderData={orderData} />
                </div>
            </div>
        </div>
    ) 
}

const PaymentInfo = ({ user, paymentHandler, cashOnDeliveryHandler}) => {
    const [select, setSelect] = useState(1);

    return (
        <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <div>
                <div className="flex w-full pb-5  mb-2">
                    <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center" onClick={() => setSelect(1)}>
                        {select === 1 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>    
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Pay with Card or Mobile Money
                    </h4>      
                </div>

                {/* pay with card or momo */}
                {select === 1 ? (
                    <div className="w-full flex border-b">
                        <form className="w-full" onSubmit={paymentHandler}>
                            <input type="submit" value="Pay Now" className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}/>
                        </form>
                    </div>
                ) : null}
            </div>
            <br />

            {/* cash on delivery */}
            <div>
                <div className="flex w-full pb-5 mb-2">
                    <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center" onClick={() => setSelect(3)}>
                        {select === 3 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Cash on Delivery
                    </h4>
                </div>

                {select === 3 ? (
                    <div className="w-full flex">
                        <form className="w-full" onSubmit={cashOnDeliveryHandler}>
                            <input type="submit" value="Confirm" className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}/>
                        </form>
                    </div>
                ) : null}    
            </div>
        </div>
    )
}

const CartData = ({ orderData }) => {
    const shipping = orderData?.shipping?.toFixed(2);
    return (
        <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
                <h5 className="text-[18px] font-[600]">GH₵ {orderData?.subTotalPrice}</h5>
            </div>
            <br />
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
                <h5 className="text-[18px] font-[600]">GH₵ {shipping}</h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
                <h5 className="text-[18px] font-[600]">{orderData?.discountPrice? "GH₵ " + orderData.discountPrice : "-"}</h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">
                GH₵ {orderData?.totalPrice}
            </h5>
            <br />
        </div>
    );
};

export default Payment