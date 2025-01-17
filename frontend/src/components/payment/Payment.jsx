import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';

const Payment = () => {
    const [orderData, setOrderData] = useState([]);
    const [open, setOpen] = useState(false);
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const orderData = JSON.parse(localStorage.getItem("latestOrder"));
        setOrderData(orderData);
    }, [])

    const paymentHandler = () => {

    }

    return (
        <div className="w-full flex flex-col items-center py-8">
            <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
                <div className="w-full 800px:w-[65%]">
                    <PaymentInfo user={user} paymentHandler={paymentHandler}/>
                </div>

                <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
                    <CartData orderData={orderData} />
                </div>
            </div>
        </div>
    ) 
}

const PaymentInfo = ({ user, paymentHandler, }) => {
    const [select, setSelect] = useState(1);

    return (
        <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <div>
                <div className="flex w-full pb-5 border-b mb-2">
                    <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center" onClick={() => setSelect(1)}>
                        {select === 1 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>    
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Pay with Card or Mobile Money
                    </h4>      
                </div>

                {/* pay with card */}
                {select === 1 ? (
                    <div className="w-full flex border-b">
                        <form className="w-full" onSubmit={paymentHandler}>
                            

                            <input type="submit" value="Submit" className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}/>
                        </form>
                    </div>
                ) : null}
            </div>




            <br />
            {/* cash on delivery */}
            <div>
                <div className="flex w-full pb-5 border-b mb-2">
                    <div className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center" onClick={() => setSelect(3)}>
                        {select === 3 ? (
                            <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
                        ) : null}
                    </div>
                    <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
                        Cash on Delivery
                    </h4>
                </div>    
            </div>
        </div>
    )
}

const CartData = ({ orderData }) => {
    const shipping = orderData?.shipping?.toFixed(2);
    return (
        <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
                <h5 className="text-[18px] font-[600]">GH₵ {orderData?.subTotalPrice}</h5>
            </div>
            <br />
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
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