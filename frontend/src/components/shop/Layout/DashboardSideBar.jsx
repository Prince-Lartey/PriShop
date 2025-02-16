import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai"
import { FiPackage, FiShoppingBag } from "react-icons/fi"
import { MdOutlineLocalOffer } from "react-icons/md"
import { RxDashboard } from "react-icons/rx"
import { VscNewFile } from "react-icons/vsc"
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom"
import { BiMessageSquareDetail } from "react-icons/bi"
import { HiOutlineReceiptRefund } from "react-icons/hi"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import axios from "axios"
import { server } from "../../../server"

const DashboardSideBar = ({ active }) => {
    const { seller } = useSelector((state) => state.seller);
    const [totalUnread, setTotalUnread] = useState(0);

    useEffect(() => {
        const fetchTotalUnreadMessages = async () => {
            try {
                const response = await axios.get(`${server}/message/get-total-unread-messages/${seller._id}`);
                setTotalUnread(response.data.totalUnread);
            } catch (error) {
                console.log(error);
            }
        };

        if (seller) {
            fetchTotalUnreadMessages();
        }
    }, [seller]);
    
    return (
        <div className="w-full h-[100vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">

            {/* single item */}
            <div className="w-full flex items-center p-4">
                <Link to="/dashboard" className="w-full flex items-center">
                    <RxDashboard size={30} color={`${active === 1 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 1 ? "text-[blue] font-semibold" : "text-[#555]" }`}>Dashboard</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-orders" className="w-full flex items-center">
                    <FiShoppingBag size={30} color={`${active === 2 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 2 ? "text-[blue] font-semibold" : "text-[#555]" }`}> All Orders</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-products" className="w-full flex items-center">
                    <FiPackage size={30} color={`${active === 3 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 3 ? "text-[blue] font-semibold" : "text-[#555]" }`}> All Products</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-create-product" className="w-full flex items-center">
                    <AiOutlineFolderAdd size={30} color={`${active === 4 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 4 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Create Product</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-events" className="w-full flex items-center">
                    <MdOutlineLocalOffer size={30} color={`${active === 5 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 5 ? "text-[blue] font-semibold" : "text-[#555]" }`}> All Events</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-create-event" className="w-full flex items-center">
                    <VscNewFile size={30} color={`${active === 6 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 6 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Create Event</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-withdraw-money" className="w-full flex items-center">
                    <CiMoneyBill size={30} color={`${active === 7 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 7 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Withdraw Money</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-messages" className="w-full flex items-center justify-between">
                    <div className="flex">
                        <BiMessageSquareDetail size={30} color={`${active === 8 ? "blue" : "#555"}`}/>
                        <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 8 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Shop Inbox</h5>
                    </div>
                    <div>
                        {totalUnread > 0 && (
                            <span className="bg-red-500 text-white text-sm px-2.5 py-1 rounded-full font-semibold">
                                {totalUnread}
                            </span>
                        )}
                    </div>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-coupons" className="w-full flex items-center">
                    <AiOutlineGift size={30} color={`${active === 9 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 9 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Discount Codes</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/dashboard-refunds" className="w-full flex items-center">
                    <HiOutlineReceiptRefund size={30} color={`${active === 10 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 10 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Refunds</h5>
                </Link>
            </div>

            <div className="w-full flex items-center p-4">
                <Link to="/settings" className="w-full flex items-center">
                    <CiSettings size={30} color={`${active === 11 ? "blue" : "#555"}`}/>
                    <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${ active === 11 ? "text-[blue] font-semibold" : "text-[#555]" }`}> Settings</h5>
                </Link>
            </div>
        </div>
    )
}

export default DashboardSideBar