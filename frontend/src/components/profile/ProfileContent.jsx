import { useSelector } from "react-redux";
import { backend_url } from "../../server"
import { AiOutlineArrowRight, AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'

const ProfileContent = ({ active }) => {
    const { user } = useSelector((state) => state.user);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [phoneNumber, setPhoneNumber] = useState();
    const [zipCode, setZipCode] = useState("00000");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="w-full">

            {/* Profile */}
            {active === 1 && (
                <>
                    <div className="flex justify-center w-full">
                        <div className="relative">
                            <img src={`${backend_url}${user?.avatar.url}`} alt="" className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"/>
                            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                                <input type="file" id="image" className="hidden" onChange={""}/>
                                <label htmlFor="image"><AiOutlineCamera /></label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="w-full px-5">
                        <form onSubmit={handleSubmit} aria-required={true}>
                            <div className="w-full 800px:flex block pb-5">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Full Name</label>
                                    <input type="text" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={name} onChange={(e) => setName(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Email Address</label>
                                    <input type="email" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>

                            <div className="w-full 800px:flex block pb-5">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Phone Number</label>
                                    <input type="number" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Zip Code</label>
                                    <input type="number" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={zipCode} onChange={(e) => setZipCode(e.target.value)}/>
                                </div>
                            </div>

                            <div className="w-full 800px:flex block pb-3">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Address 1</label>
                                    <input type="address" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={address1} onChange={(e) => setAddress1(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Address 2</label>
                                    <input type="address" className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required value={address2} onChange={(e) => setAddress2(e.target.value)}/>
                                </div>
                            </div>

                            <input className={`w-[250px] h-[40px] bg-[#3a24db] text-center text-[white] rounded-[3px] mt-8 cursor-pointer`} required value="Update" type="submit"/>
                        </form>
                    </div>
                </>
            )}

            {/* Order Page */}
            {active === 2 && (
                <div>
                    <AllOrders />
                </div>
            )}

            {/* Refund Page */}
            {active === 3 && (
                <div>
                    <AllRefundOrders />
                </div>
            )}
        </div>
    )
}

const AllOrders = () => {
    const orders = [
        {
            _id: "354525hhbr32hb5h3h",
            orderItems: [
                {name: "Iphone 14 pro max", },
            ],
            totalPrice: 1000,
            orderStatus: "Processing"
        }
    ]

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
                <>
                    <Link to={`/user/order/${params.id}`}>
                        <Button>
                            <AiOutlineArrowRight size={20} />
                        </Button>
                    </Link>
                </>
                );
            },
        },
    ];

    const row = [];

    orders && orders.forEach((item) => {
        row.push({
            id: item._id,
            itemsQty: item.orderItems.length,
            total: "GH₵ " + item.totalPrice,
            status: item.orderStatus,
        });
    });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
            />
        </div>
    )
    
}

const AllRefundOrders = () => {
    const orders = [
        {
            _id: "354525hhbr32hb5h3h",
            orderItems: [
                {name: "Iphone 14 pro max", },
            ],
            totalPrice: 1000,
            orderStatus: "Processing"
        }
    ]

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
                <>
                    <Link to={`/user/order/${params.id}`}>
                        <Button>
                            <AiOutlineArrowRight size={20} />
                        </Button>
                    </Link>
                </>
                );
            },
        },
    ];

    const row = [];

    orders && orders.forEach((item) => {
        row.push({
            id: item._id,
            itemsQty: item.orderItems.length,
            total: "GH₵ " + item.totalPrice,
            status: item.orderStatus,
        });
    });

    return (
        <div className="pl-8 pt-1">
            <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
            />
        </div>
    )
}

export default ProfileContent