import { useEffect, useState } from "react";
import { server } from "../../server";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { AiOutlineEye } from "react-icons/ai";
import { DataGrid } from "@mui/x-data-grid";

const AllEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get(`${server}/event/admin-all-events`, {withCredentials: true}).then((res) =>{
            setEvents(res.data.events);
        })
    }, []);

    const columns = [
        { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
        { field: "shopname", headerName: "Shop name", minWidth: 150, flex: 0.7 },
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
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/product/${params.id}?isEvent=true`}>
                        <Button>
                            <AiOutlineEye size={20} />
                        </Button>
                    </Link>
                );
            },
        },
    ];
    
    const row = [];

    events && events.forEach((item) => {
        row.push({
            id: item._id,
            shopname: item.shop.name,
            name: item.name,
            price: "GH₵ " + item.discountPrice,
            Stock: item.stock,
            sold: item.sold_out,
        });
    });
    

    return (
        <div className="w-full flex justify-center pt-5">
            <div className="w-[97%]">
                <h3 className="text-[22px] font-Poppins pb-2">All Events</h3>
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

export default AllEvents