import DashboardHeader from "../../components/shop/Layout/DashboardHeader"
import DashboardSideBar from "../../components/shop/Layout/DashboardSideBar";

const ShopDashboardPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-center justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={1} />
                </div>
            </div>
        </div>
    )
}

export default ShopDashboardPage