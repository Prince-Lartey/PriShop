import { Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import { useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";

const AllOrders = () => {
    const { orders, isLoading } = useSelector((state) => state.orders);
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfShop(seller._id));
    }, [dispatch]);

    const columns = [
        { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    
        {
            field: "status",
            headerName: "Status",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.row.status === "Delivered" ? "greenColor" : "redColor";
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
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
            return (
                <Link to={`/order/${params.id}`}>
                    <Button>
                        <AiOutlineArrowRight size={20} />
                    </Button>
                </Link>
            );
            },
        },
    ];

    const row = [];

    orders && orders.forEach((item) => {
        row.push({
            id: item._id,
            itemsQty: item.cart[0].qty,
            total: "GH₵ " + item.totalPrice,
            status: item.status,
        });
    });

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full mx-8 pt-1 mt-10 bg-white">
                    <DataGrid
                        rows={row}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        autoHeight
                    />
                </div>
            )}
        </>
    );
};

export default AllOrders;