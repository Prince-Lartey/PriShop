import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PriShopLogo from "../../../assets/logo/PriShopLogo.png"
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useEffect, useState } from "react"
import axios from "axios"
import { server } from "../../../server.js"

const DashboardHeader = () => {
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
        <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
            <div>
                <Link to="/dashboard">
                    <img src={PriShopLogo} alt="" className="w-[120px] rounded-xl"/>
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <Link to="/dashboard-coupons" className="800px:block hidden">
                        <AiOutlineGift color="#555" size={30} className="mx-5 cursor-pointer" title="Coupons"/>
                    </Link>
                    <Link to="/dashboard-events" className="800px:block hidden">
                        <MdOutlineLocalOffer color="#555" size={30} className="mx-5 cursor-pointer" title="Events"/>
                    </Link>
                    <Link to="/dashboard-products" className="800px:block hidden">
                        <FiShoppingBag color="#555" size={30} className="mx-5 cursor-pointer" title="Products"/>
                    </Link>
                    <Link to="/dashboard-orders" className="800px:block hidden">
                        <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" title="Orders"/>
                    </Link>
                    <Link to="/dashboard-messages" className="800px:block hidden relative mx-5">
                        <BiMessageSquareDetail color="#555" size={30} className=" cursor-pointer" title="Messages"/>
                        {totalUnread > 0 && (
                            <span className="absolute right-0 top-0 rounded-full bg-red-500 w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                                {totalUnread}
                            </span>
                        )}
                    </Link>
                    <Link to={`/shop/${seller._id}`}>
                        <img src={`${seller.avatar?.url}`} alt="" className="w-[50px] h-[50px] rounded-full object-cover"/>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader