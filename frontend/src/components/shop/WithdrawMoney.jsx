import { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import { server } from '../../server';
import { loadSeller } from '../../redux/actions/user';

const WithdrawMoney = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const { seller } = useSelector((state) => state.seller);
    const [deliveredOrder, setDeliveredOrder] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(50);
    const [bankInfo, setBankInfo] = useState({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: null,
        bankAccountNumber: null,
        bankHolderName: "",
        bankAddress: "",
    });

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));

        const orderData = orders?.filter((item) => item.status === "Delivered")
        setDeliveredOrder(orderData)
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const withdrawMethod = {
            bankName: bankInfo.bankName,
            bankCountry: bankInfo.bankCountry,
            bankSwiftCode: bankInfo.bankSwiftCode,
            bankAccountNumber: bankInfo.bankAccountNumber,
            bankHolderName: bankInfo.bankHolderName,
            bankAddress: bankInfo.bankAddress,
        };

        setPaymentMethod(false);

        await axios.put(`${server}/shop/update-payment-methods`,
            {
                withdrawMethod,
            },
            { withCredentials: true }
        )
        .then((res) => {
            toast.success("Withdraw method added successfully!");
            dispatch(loadSeller());
            setBankInfo({
                bankName: "",
                bankCountry: "",
                bankSwiftCode: null,
                bankAccountNumber: null,
                bankHolderName: "",
                bankAddress: "",
            });
        })
        .catch((error) => {
            console.log(error.response.data.message);
        });
    };

    

    const error = () => {
        toast.error("You not have enough balance to withdraw!");
    };

    const totalEarningWithoutTax = deliveredOrder?.reduce((acc, item) => acc + item.totalPrice, 0)

    const serviceCharge = totalEarningWithoutTax * 0.1
    const availableBalance =  totalEarningWithoutTax - serviceCharge

    return (
        <div className="w-full h-[90vh] p-8">
            <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
                <h5 className="text-[20px] pb-4">
                    Available Balance: GH₵ {availableBalance}
                </h5>
                <div className={`${styles.button} text-white !h-[42px] !rounded`} onClick={() => (availableBalance < 50 ? error() : setOpen(true))}>
                    Withdraw
                </div>
            </div>

            {open && (
                <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
                    <div className={`w-[95%] 800px:w-[50%] bg-white shadow rounded ${ paymentMethod ? "h-[80vh] overflow-y-scroll" : "h-[unset]"} min-h-[40vh] p-3`}>
                        <div className="w-full flex justify-end">
                            <RxCross1 size={25} onClick={() => setOpen(false) || setPaymentMethod(false)} className="cursor-pointer"/>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WithdrawMoney