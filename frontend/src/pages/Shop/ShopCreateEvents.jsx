import DashboardHeader from "../../components/shop/Layout/DashboardHeader"
import DashboardSideBar from "../../components/shop/Layout/DashboardSideBar"
import CreateEvent from "../../components/shop/CreateEvent"

const ShopCreateEvents = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-center justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={6} />
                </div>
                <div className="w-full flex justify-center">
                    <CreateEvent />
                </div>
            </div>
        </div>
    )
}

export default ShopCreateEvents