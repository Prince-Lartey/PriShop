import AdminHeader from "../components/layout/AdminHeader";
import AdminSideBar from "../components/admin/Layout/AdminSideBar";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order"
import { useEffect } from "react";
import Loader from "../components/layout/Loader";
import { DataGrid } from "@mui/x-data-grid";

const AdminDashboardOrders = () => {
    const dispatch = useDispatch();

    const { adminOrders, adminOrderLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getAllOrdersOfAdmin());
    }, [])

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === "Delivered" || params.row.status === "Refund Successful" ? "greenColor" : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Items Qty",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },
    
        {
            field: "total",
            headerName: "Total",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: "createdAt",
            headerName: "Order Date",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
    ];
    
    const row = [];
    adminOrders && adminOrders.forEach((item) => {
        row.push({
            id: item._id,
            itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
            total: "GH₵ " + item?.totalPrice,
            status: item?.status,
            createdAt: item?.createdAt.slice(0,10),
        });
    });

    return (
        <div>
            <AdminHeader />
            <div className="w-full flex">
                <div className="flex items-start justify-between w-full">
                    <div className="w-[80px] 800px:w-[330px]">
                        <AdminSideBar active={2} />
                    </div>

                    {
                        adminOrderLoading ? (
                            <Loader />
                        ) : (
                            <div className="w-full flex justify-center pt-5">
                            <div className="w-[97%]">
                                <h3 className="text-[22px] font-Poppins pb-2">All Orders</h3>
                                <div className="w-full min-h-[45vh] bg-white rounded">
                                    <DataGrid
                                        rows={row}
                                        columns={columns}
                                        pageSize={10}
                                        disableSelectionOnClick
                                        autoHeight
                                    />
                                </div>
                            </div>
                        </div>
                        )
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardOrders