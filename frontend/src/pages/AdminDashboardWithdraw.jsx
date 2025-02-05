import AdminHeader from '../components/layout/AdminHeader'
import AdminSideBar from '../components/admin/Layout/AdminSideBar'
import AllWithdraw from "../components/admin/AllWithdraw.jsx";

const AdminDashboardWithdraw = () => {
    return (
        <div>
            <AdminHeader />
            <div className="w-full flex">
                <div className="flex items-start justify-between w-full">
                    <div className="w-[80px] 800px:w-[330px]">
                        <AdminSideBar active={7} />
                    </div>
                    <AllWithdraw />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardWithdraw