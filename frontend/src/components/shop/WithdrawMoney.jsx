import { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import { server } from '../../server';
import { loadSeller } from '../../redux/actions/user';
import { AiOutlineDelete } from 'react-icons/ai';

const WithdrawMoney = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { seller } = useSelector((state) => state.seller);
    const [paymentMethod, setPaymentMethod] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState(50);
    const [networkProvider, setNetworkProvider] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    // Validation function
    const validateMobileNumber = (network, number) => {
        const validPrefixes = {
            'MTN': ['024', '025', '054', '055', '059', '053'],
            'Vodafone': ['020', '050'],
            'AirtelTigo': ['026', '056', '027', '057']
        };

        if (!validPrefixes[network]?.some(prefix => number.startsWith(prefix))) {
            toast.error(`Invalid number for ${network}.`);
            return false;
        }
        return true;
    };

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
    }, [dispatch]);

    // Handle adding a new withdrawal method (Paystack recipient)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateMobileNumber(networkProvider, mobileNumber)) return;

        setPaymentMethod(false);

        await axios.post(`${server}/withdraw/create-recipient`, {
            name: seller.name,
            mobileNumber,
            networkProvider,
        }, { withCredentials: true })
        .then(() => {
            toast.success("Withdraw method added successfully!");
            dispatch(loadSeller());
        })
        .catch((error) => {
            toast.error(error.response?.data?.message || "Failed to add withdraw method.");
        });
    };

    const deleteHandler = async () => {
        await axios.delete(`${server}/shop/delete-withdraw-method`, {
            withCredentials: true,
        })
        .then(() => {
            toast.success("Withdraw method deleted successfully!");
            dispatch(loadSeller());
        });
    };

    const error = () => {
        toast.error("You not have enough balance to withdraw!");
    };

    const withdrawHandler = async () => {
        if (withdrawAmount < 50 || withdrawAmount > availableBalance) {
            toast.error("You can't withdraw this amount!");
            return;
        }

        await axios.post(`${server}/withdraw/create-withdraw-request`,
            { amount: withdrawAmount,},
            { withCredentials: true }
        )
        .then(() => {
            toast.success("Withdrawal request sent successfully!");
            setOpen(false);
        })
        .catch((error) => {
            toast.error(error.response?.data?.message || "Withdrawal failed.");
        })
    }
    

    const availableBalance = seller?.availableBalance.toFixed(2)

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
                    <div className={`w-[95%] 800px:w-[30%] bg-white shadow rounded ${ paymentMethod ? "h-[55vh] overflow-y-scroll" : "h-[unset]"} min-h-[40vh] p-3`}>
                        <div className="w-full flex justify-end">
                            <RxCross1 size={25} onClick={() => setOpen(false) || setPaymentMethod(false)} className="cursor-pointer"/>
                        </div>

                        {paymentMethod ? (
                            <div>
                                <h3 className="text-[22px] font-Poppins text-center font-[600]">Add new Withdraw Method:</h3>
                                <form onSubmit={handleSubmit} className='mt-2'>
                                    <div className="pt-2">
                                        <label htmlFor='NetworkProvider'>Network Provider<span className="text-red-500">*</span></label>
                                        <select type="text" name="" required value={networkProvider} onChange={(e) => setNetworkProvider(e.target.value)} id="" placeholder="Enter your bank Holder name!" className={`${styles.input} mt-2`}>
                                            <option value="">Select</option>
                                            <option value="MTN">MTN</option>
                                            <option value="Vodafone">Vodafone</option>
                                            <option value="AirtelTigo">AirtelTigo</option>
                                        </select>
                                    </div>

                                    <div className="pt-2">
                                        <label htmlFor='MMnumber'>Mobile Money Number{" "}<span className="text-red-500">*</span></label>
                                        <input type="number" name="" id="" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required placeholder="Enter your Mobile Money Number!" className={`${styles.input} mt-2 px-2`}/>
                                    </div>

                                    <button type="submit" className={`${styles.button} mb-3 text-white`}>Add</button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-[22px] font-Poppins">
                                    Available Withdraw Methods:
                                </h3>

                                {seller && seller?.paystackRecipientCode ? (
                                    <div className='mt-4 px-3'>
                                        <div className="flex w-full justify-between items-center bg-slate-200 rounded p-2">
                                            <div className="">
                                                <h5>Network Provider: {seller?.withdrawMethod.networkProvider}</h5>
                                                <h5>Mobile Money Number:{" "}{"*".repeat(seller?.withdrawMethod.mobileNumber.length - 3) + seller?.withdrawMethod.mobileNumber.slice(-3)}</h5>
                                            </div>
                                            <div className="">
                                                <AiOutlineDelete size={25} className="cursor-pointer hover:text-red-500" onClick={() => deleteHandler()} title='Delete Withdrawal Method'/>
                                            </div>
                                        </div>
                                        <br />

                                        <h4>Available Balance: GH₵ {availableBalance}</h4>
                                        <br />

                                        <div className="800px:flex w-full items-center">
                                            <input type="number" placeholder="Amount..." value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="800px:w-[100px] w-[full] border 800px:mr-3 p-1 rounded"/>
                                            <div className={`${styles.button} !h-[42px] text-white`} onClick={withdrawHandler}>
                                                Withdraw
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center mt-4'>
                                        <p className="text-[18px] pt-2">No Withdraw Methods available!</p>
                                        <div className="w-full flex items-center justify-center">
                                            <div className={`${styles.button} text-[#fff] text-[18px] mt-4`} onClick={() => setPaymentMethod(true)}>
                                                Add new
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default WithdrawMoney