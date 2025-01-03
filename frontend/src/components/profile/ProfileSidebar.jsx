import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import {MdOutlineAdminPanelSettings, MdOutlinePassword, MdOutlineTrackChanges,} from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { TbAddressBook } from "react-icons/tb"
import { useNavigate } from "react-router-dom";

const ProfileSidebar = ({ setActive, active }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(1)}>
                <RxPerson size={20} color={active === 1 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 1 ? "text-[blue]" : "" } 800px:block hidden`}> Profile</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(2)}>
                <HiOutlineShoppingBag size={20} color={active === 2 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 2 ? "text-[blue]" : "" } 800px:block hidden`}> Orders</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(3)}>
                <HiOutlineReceiptRefund size={20} color={active === 3 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 3 ? "text-[blue]" : "" } 800px:block hidden`}> Refunds</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(4) || navigate("/inbox")}>
                <AiOutlineMessage size={20} color={active === 4 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 4 ? "text-[blue]" : "" } 800px:block hidden`}> Inbox</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(5)}>
                <MdOutlineTrackChanges size={20} color={active === 5 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 5 ? "text-[blue]" : "" } 800px:block hidden`}> Track Orders</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(6)}>
                <RiLockPasswordLine size={20} color={active === 6 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 6 ? "text-[blue]" : "" } 800px:block hidden`}> Change Password</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(7)}>
                <TbAddressBook size={20} color={active === 7 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 7 ? "text-[blue]" : "" } 800px:block hidden`}> Address</span>
            </div>

            <div className="flex items-center cursor-pointer w-full mb-8" onClick={() => setActive(8)}>
                <AiOutlineLogin size={20} color={active === 8 ? "blue" : ""} />
                <span className={`pl-3 ${ active === 8 ? "text-[blue]" : "" } 800px:block hidden`}> Log out</span>
            </div>
        </div>
    )
}

export default ProfileSidebar