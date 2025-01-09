import DashboardHeader from "../../components/shop/Layout/DashboardHeader"
import DashboardSideBar from "../../components/shop/Layout/DashboardSideBar"
import AllEvents from "../../components/shop/AllEvents.jsx"

const ShopAllEvents = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={5} />
                </div>
                <div className="w-full justify-center flex">
                    <AllEvents />
                </div>
            </div>
        </div>
    )
}

export default ShopAllEvents
