import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSellers } from "../../redux/actions/sellers";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";

const AllSellers = () => {
    const dispatch = useDispatch();
    const { sellers } = useSelector((state) => state.seller);
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        dispatch(getAllSellers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        await axios.delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
        .then((res) => {
            toast.success(res.data.message);
        });

        dispatch(getAllSellers());
    };

    const columns = [
        { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    
        {
            field: "name",
            headerName: "name",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "email",
            headerName: "Email",
            type: "text",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "address",
            headerName: "Seller Address",
            type: "text",
            minWidth: 130,
            flex: 0.7,
        },
    
        {
            field: "joinedAt",
            headerName: "joinedAt",
            type: "text",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: "  ",
            flex: 1,
            minWidth: 150,
            headerName: "Preview Shop",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/shop/preview/${params.id}`}>
                        <Button>
                            <AiOutlineEye size={20} />
                        </Button>
                    </Link>
                );
            },
        },
        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "Delete Seller",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Button onClick={() => setUserId(params.id) || setOpen(true)}>
                        <AiOutlineDelete size={20} />
                    </Button>
                );
            },
        },
    ];

    const row = [];
    sellers && sellers.forEach((item) => {
        row.push({
            id: item._id,
            name: item?.name,
            email: item?.email,
            joinedAt: item.createdAt.slice(0, 10),
            address: item.address,
        });
    });

    return (
        <div className="w-full flex justify-center pt-5">
            <div className="w-[97%]">
                <h3 className="text-[22px] font-Poppins pb-2">All Sellers</h3>
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

export default AllSellers