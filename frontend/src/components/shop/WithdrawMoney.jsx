import { useEffect, useState } from 'react'
import styles from '../../styles/styles'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';

const WithdrawMoney = () => {
    const dispatch = useDispatch();
    const { orders } = useSelector((state) => state.orders);
    const { seller } = useSelector((state) => state.seller);
    const [deliveredOrder, setDeliveredOrder] = useState(null)

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));

        const orderData = orders?.filter((item) => item.status === "Delivered")
        setDeliveredOrder(orderData)
    }, [dispatch]);

    const totalEarningWithoutTax = deliveredOrder?.reduce((acc, item) => acc + item.totalPrice, 0)

    const serviceCharge = totalEarningWithoutTax * 0.1
    const availableBalance =  totalEarningWithoutTax - serviceCharge

    return (
        <div className="w-full h-[90vh] p-8">
            <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
                <h5 className="text-[20px] pb-4">
                    Available Balance: GH₵ {availableBalance}
                </h5>
                <div className={`${styles.button} text-white !h-[42px] !rounded`} >
                    Withdraw
                </div>
            </div>
        </div>
    )
}

export default WithdrawMoney