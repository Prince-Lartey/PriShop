import DashboardHeader from "../../components/shop/Layout/DashboardHeader"
import DashboardSideBar from "../../components/shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/shop/DashboardHero";

const ShopDashboardPage = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex items-start justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={1} />
                </div>
                <DashboardHero />
            </div>
        </div>
    )
}

export default ShopDashboardPage