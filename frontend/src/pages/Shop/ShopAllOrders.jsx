import DashboardHeader from '../../components/shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/shop/Layout/DashboardSideBar'
import AllOrders from "../../components/shop/AllOrders.jsx";

const ShopAllOrders = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={2} />
                </div>
                <div className="w-full justify-center flex">
                    <AllOrders />
                </div>
            </div>
        </div>
    )
}

export default ShopAllOrders