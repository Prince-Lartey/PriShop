import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PriShopLogo from "../../assets/logo/PriShopLogo.png"

const AdminHeader = () => {
    const {user} = useSelector((state) => state.user);

    return (
        <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
            <div>
                <Link to="/">
                    <img src={PriShopLogo} alt="" className="w-[120px] rounded-xl"/>
                </Link>
            </div>
            <div className="flex items-center">
                <div className="flex items-center mr-4">
                    <img src={`${user.avatar.url}`} alt="" className="w-[50px] h-[50px] rounded-full object-cover" />
                </div>
            </div>
        </div>
    )
}

export default AdminHeader