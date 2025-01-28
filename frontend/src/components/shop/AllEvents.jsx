import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteProduct } from "../../redux/actions/product";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Loader from "../layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event";

const AllEvents = ({ isEvent }) => {
    const { events, isLoading } = useSelector((state) => state.events)
    const { seller } = useSelector((state) => state.seller);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllEventsShop(seller._id));
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteEvent(id));
        window.location.reload();
    };

    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Name",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "price",
            headerName: "Price",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "Stock",
            headerName: "Stock",
            type: "number",
            minWidth: 80,
            flex: 0.5,
        },
    
        {
            field: "sold",
            headerName: "Sold out",
            type: "number",
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: "Preview",
            flex: 0.8,
            minWidth: 100,
            headerName: "Preview",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/product/${params.id}?isEvent=true`}>
                        <Button title="View product">
                            <AiOutlineEye size={20} />
                        </Button>
                    </Link>
                );
            },
        },
        {
            field: "Delete",
            flex: 0.8,
            minWidth: 120,
            headerName: "Delete",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Button title="Delete event product">
                        <AiOutlineDelete size={20} onClick={() => handleDelete(params.id)}/>
                    </Button>
                );
            },
        },
    ];

    const row = [];

    events && events.forEach((item) => {
        row.push({
            id: item._id,
            name: item.name,
            price: "GH₵ " + item.discountPrice,
            Stock: item.stock,
            sold: item.sold_out,
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
    )
}

export default AllEvents