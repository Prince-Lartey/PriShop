import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server"
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import { MdOutlineTrackChanges } from "react-icons/md";
import { updateUserInformation } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ProfileContent = ({ active }) => {
    const { user, error, successMessage } = useSelector((state) => state.user);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (successMessage) {
            toast.success(successMessage || "Profile updated successfully!");
            dispatch({ type: "clearMessages" });
        }
    }, [error, successMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInformation(name, email, phoneNumber, password))
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
                            <div className="w-full 800px:flex block 800px:pb-5">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Full Name</label>
                                    <input type="text" className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={name} onChange={(e) => setName(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Email Address</label>
                                    <input type="email" className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={email} onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>

                            <div className="w-full 800px:flex block 800px:pb-5">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Phone Number</label>
                                    <input type="number" className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label className="block pb-1">Enter your password</label>
                                    <div className="relative">
                                        <input type={visible ? "text" : "password"} className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={password} onChange={(e) => setPassword(e.target.value)}/>
                                        {visible ? (<AiOutlineEye className="absolute right-8 top-1 cursor-pointer" size={25} onClick={() => setVisible(false)} />) : (<AiOutlineEyeInvisible className="absolute right-8 top-1 cursor-pointer" size={25} onClick={() => setVisible(true)}/>)}
                                    </div>
                                </div>
                            </div>

                            <input className={`w-[250px] h-[40px] bg-[#3a24db] text-center text-[white] rounded-[3px] mt-8 cursor-pointer`} required value="Update" type="submit"/>
                        </form>
                    </div>
                </>
            )}

            {/* Order */}
            {active === 2 && (
                <div>
                    <AllOrders />
                </div>
            )}

            {/* Refund */}
            {active === 3 && (
                <div>
                    <AllRefundOrders />
                </div>
            )}

            {/* Track Order */}
            {active === 5 && (
                <div>
                    <TrackOrder />
                </div>
            )}

            {/* Payment Method */}
            {active === 6 && (
                <div>
                    <PaymentMethod />
                </div>
            )}

            {/* User Address */}
            {active === 7 && (
                <div>
                    <Address />
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

const  TrackOrder = () => {
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
            minWidth: 130,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                <>
                    <Link to={`/order/${params.id}`}>
                        <Button>
                            <MdOutlineTrackChanges size={20} />
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

const PaymentMethod = () => {
    return (
        <div className="w-full px-5">
            <div className="flex w-full items-center justify-between">
                <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">Payment Methods</h1>
                <div className={`${styles.button} !rounded-md`}>
                    <span className="text-[#fff]">Add New</span>
                </div>
            </div>
            <br />
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 ">
                <div className="flex items-center">
                    <img src="https://bonik-react.vercel.app/assets/images/payment-methods/Visa.svg" alt="" />
                    <h5 className="pl-5 font-[600] ">Prince Lartey</h5>
                </div>
                <div className="flex pl-8 items-center">
                    <h6>1234 **** **** ****</h6>
                    <h5 className="pl-6">09/2030</h5>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8 ">
                    <AiOutlineDelete size={25} className="cursor-pointer"/>
                </div>
            </div>
        </div>
    )
}

const Address = () => {
    return (
        <div className="w-full px-5">
            <div className="flex w-full items-center justify-between">
                <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">Payment Methods</h1>
                <div className={`${styles.button} !rounded-md`}>
                    <span className="text-[#fff]">Add New</span>
                </div>
            </div>
            <br />
            <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 ">
                <div className="flex items-center">
                    <h5 className="pl-5 font-[600] ">Default</h5>
                </div>
                <div className="flex pl-8 items-center">
                    <h6>GA-310-8822, Odonti street, Accra, Ghana</h6>
                </div>
                <div className="flex pl-8 items-center">
                    <h6>(233) 5457 43115</h6>
                </div>
                <div className="min-w-[10%] flex items-center justify-between pl-8 ">
                    <AiOutlineDelete size={25} className="cursor-pointer"/>
                </div>
            </div>
        </div>
    )
}

export default ProfileContent