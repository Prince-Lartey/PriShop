import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import { getAllSellers } from "../../redux/actions/sellers";

const AdminDashboardMain = () => {
    const dispatch = useDispatch();

    const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
    const { sellers } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(getAllOrdersOfAdmin());
        dispatch(getAllSellers());
    }, []);

    const adminEarning = adminOrders && adminOrders.reduce((acc,item) => acc + item.totalPrice * .10, 0);

    return (
        <div>AdminDashboardMain</div>
    )
}

export default AdminDashboardMain