import DashboardHeader from '../../components/shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/shop/Layout/DashboardSideBar'
import AllProducts from "../../components/shop/AllProducts";

const ShopAllProducts = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={3} />
                </div>
                <div className="w-full flex justify-center">
                    <AllProducts />
                </div>
            </div>
        </div>
    )
}

export default ShopAllProducts