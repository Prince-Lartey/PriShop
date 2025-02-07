import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../../server";
import { BsPencil } from "react-icons/bs";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { Button } from "@mui/material";

const AllWithdraw = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [withdrawData, setWithdrawData] = useState();
    const [withdrawStatus,setWithdrawStatus] = useState('Processing');

    useEffect(() => {
        axios.get(`${server}/withdraw/get-all-withdraw-request`, {
            withCredentials: true,
        })
        .then((res) => {
            setData(res.data.withdraws);
        })
        .catch((error) => {
            console.log(error.response.data.message);
        });
    }, []);

    const columns = [
        { field: "id", headerName: "Withdraw Id", minWidth: 150, flex: 0.7 },
        {
            field: "name",
            headerName: "Shop Name",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "shopId",
            headerName: "Shop Id",
            minWidth: 180,
            flex: 1.4,
        },
        {
            field: "amount",
            headerName: "Amount",
            minWidth: 100,
            flex: 0.6,
        },
        {
            field: "status",
            headerName: "Status",
            type: "text",
            minWidth: 80,
            flex: 0.5,
            cellClassName: (params) => {
                return params.row.status === "Approved" ? "greenColor" : "redColor";
            },
        },
        {
            field: "createdAt",
            headerName: "Requested At",
            type: "number",
            minWidth: 130,
            flex: 0.6,
        },
        {
            field: " ",
            headerName: "Update Status",
            type: "number",
            minWidth: 130,
            flex: 0.6,
            renderCell: (params) => {
    
                return (
                    <Button>
                        <BsPencil
                            size={20}
                            className={`${params.row.status !== "Processing" ? 'hidden' : '' } mr-2 cursor-pointer`}
                            onClick={() => setOpen(true) || setWithdrawData(params.row)}
                            title="Update Status"
                        />
                    </Button>
                );
            },
        },
    ];

    const handleSubmit = async () => {
        await axios.put(`${server}/withdraw/update-withdraw-request/${withdrawData.id}`,{
            sellerId: withdrawData.shopId,
        },{withCredentials: true})
        .then((res) => {
            toast.success("Withdraw request updated successfully!");
            setData(res.data.withdraws);
            setOpen(false);
            window.location.reload()
        });
    };

    const row = [];

    data && data.forEach((item) => {
        row.push({
            id: item._id,
            shopId: item.seller._id,
            name: item.seller.name,
            amount: "GH₵ " + item.amount,
            status: item.status,
            createdAt: item.createdAt.slice(0, 10),
        });
    });

    return (
        <div className="w-full flex items-center pt-5 justify-center">
            <div className="w-[95%] bg-white">
                <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    autoHeight
                />
            </div>

            {open && (
                <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
                    <div className="w-[30%] min-h-[40vh] bg-white rounded shadow p-4">
                        <div className="flex justify-end w-full">
                            <RxCross1 size={25} onClick={() => setOpen(false)} />
                        </div>
                        <h1 className="text-[25px] text-center font-Poppins">Update Withdraw status </h1>
                        <br />
                        <div className="flex flex-col items-center mt-3">
                            <select name="" id="" onChange={(e) => setWithdrawStatus(e.target.value)} className="w-[200px] h-[35px] border rounded">
                                <option value={withdrawStatus}>{withdrawData.status}</option>
                                <option value={withdrawStatus}>Approve Request</option>
                            </select>
                            <button type="submit" className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`} onClick={handleSubmit} >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllWithdraw