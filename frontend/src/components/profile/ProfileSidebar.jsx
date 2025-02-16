import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import {MdOutlineAdminPanelSettings, MdOutlinePassword, MdOutlinePayments, MdOutlineTrackChanges,} from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { TbAddressBook } from "react-icons/tb"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"

const ProfileSidebar = ({ setActive, active }) => {
    const { user } = useSelector((state) => state.user);
    const [totalUnread, setTotalUnread] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTotalUnreadMessages = async () => {
            try {
                const response = await axios.get(`${server}/message/get-total-unread-messages/${user._id}`);
                setTotalUnread(response.data.totalUnread);
            } catch (error) {
                console.log(error);
            }
        };

        if (user) {
            fetchTotalUnreadMessages();
        }
    }, [user]);

    const logoutHandler = () => {
        axios.get(`${server}/user/logout`, { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message);
                window.location.reload(true);
                navigate("/login");
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    return (
        <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(1)}>
                <RxPerson size={20} color={active === 1 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 1 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Profile</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(2)}>
                <HiOutlineShoppingBag size={20} color={active === 2 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 2 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Orders</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(3)}>
                <HiOutlineReceiptRefund size={20} color={active === 3 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 3 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Refunds</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8 justify-between" onClick={() => setActive(4) || navigate("/inbox")}>
                <div className="flex">
                    <AiOutlineMessage size={20} color={active === 4 ? "blue" : ""} />
                    <span className={`pl-3 ${ active === 4 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Inbox</span>
                </div>

                {totalUnread > 0 && (
                    <span className="bg-red-500 text-white text-sm px-2.5 py-1 rounded-full font-semibold">
                        {totalUnread}
                    </span>
                )}
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(5)}>
                <MdOutlineTrackChanges size={20} color={active === 5 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 5 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Track Orders</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(6)}>
                <RiLockPasswordLine size={20} color={active === 6 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 6 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Change Password</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(7)}>
                <TbAddressBook size={20} color={active === 7 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 7 ? "text-[blue] font-semibold" : "" } 800px:block hidden`}> Address</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(8) || logoutHandler()}>
                <AiOutlineLogin size={20} color={active === 8 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 8 ? "text-[blue]" : "" } 800px:block hidden`}> Log out</span>
            </div>
        </div>
    )
}

export default ProfileSidebar