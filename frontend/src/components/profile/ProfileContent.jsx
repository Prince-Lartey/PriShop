import { useDispatch, useSelector } from "react-redux";
import {  server } from "../../server"
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid'
import { MdOutlineTrackChanges } from "react-icons/md";
import { deleteUserAddress, loadUser, updateUserAddress, updateUserInformation } from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { Country, State } from "country-state-city"
import { FiLoader } from "react-icons/fi";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
    const { user, error, successMessage } = useSelector((state) => state.user);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [avatar, setAvatar] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch({ type: "clearMessages" });
        }
    }, [error, successMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInformation(name, email, phoneNumber, password))
    };

    const handleImage = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
    
            setAvatar(file);
    
            const formData = new FormData();
            formData.append("avatar", file);
    
            await axios.put(`${server}/user/update-avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            
            dispatch(loadUser())
            toast.success("Avatar updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update avatar");
            console.error(error);
        }
    }

    return (
        <div className="w-full">

            {/* Profile */}
            {active === 1 && (
                <>
                    <div className="flex justify-center w-full">
                        <div className="relative">
                            <img src={`${user?.avatar.url}`} alt="" className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"/>
                            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                                <input type="file" id="image" className="hidden" onChange={handleImage}/>
                                <label htmlFor="image"><AiOutlineCamera /></label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <div className="w-full px-5">
                        <form onSubmit={handleSubmit}>
                            <div className="w-full 800px:flex block 800px:pb-5">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label htmlFor="name" className="block pb-1">Full Name</label>
                                    <input type="text" className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={name} onChange={(e) => setName(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label htmlFor="email" className="block pb-1">Email Address</label>
                                    <input type="email" className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={email} onChange={(e) => setEmail(e.target.value)} readOnly/>
                                </div>
                            </div>

                            <div className="w-full 800px:flex block 800px:pb-5">
                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label htmlFor="phoneNumber" className="block pb-1">Phone Number</label>
                                    <input type="number" className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                                </div>

                                <div className=" w-[100%] 800px:w-[50%]">
                                    <label htmlFor="password" className="block pb-1">Enter your password</label>
                                    <div className="relative">
                                        <input type={visible ? "text" : "password"} className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={password} onChange={(e) => setPassword(e.target.value)}/>
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

            {/* Change Password */}
            {active === 6 && (
                <div>
                    <ChangePassword />
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
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.orders);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, []);

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
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/user/order/${params.id}`}>
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
            itemsQty: item.cart.length,
            total: "GH₵ " + item.totalPrice,
            status: item.status,
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
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.orders);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, []);

    const eligibleOrders = orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Successful");

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
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/user/order/${params.id}`}>
                        <Button>
                            <AiOutlineArrowRight size={20} />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const row = [];

    eligibleOrders && eligibleOrders.forEach((item) => {
        row.push({
            id: item._id,
            itemsQty: item.cart.length,
            total: "GH₵ " + item.totalPrice,
            status: item.status,
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
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.orders);
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, []);

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
            field: " ",
            flex: 1,
            minWidth: 130,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/user/track/order/${params.id}`}>
                        <Button>
                            <MdOutlineTrackChanges size={20} title="Track order"/>
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
            itemsQty: item.cart.length,
            total: "GH₵ " + item.totalPrice,
            status: item.status,
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

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [visible, setVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const passwordChangeHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true)
    
        await axios.put(`${server}/user/update-user-password`,
            { oldPassword, newPassword, confirmPassword },
            { withCredentials: true })
            .then((res) => {
                toast.success(res.data.message);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setIsLoading(false);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="w-full px-5">
            <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">Change Password</h1>
            
            <div className="w-full">
                <form onSubmit={passwordChangeHandler} className="flex flex-col items-center">
                    <div className=" w-[100%] 800px:w-[50%] mt-5">
                        <label htmlFor="oldPassword" className="block pb-2">Enter your old password</label>
                        <div className="relative">
                            <input type={visible ? "text" : "password"} className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                        </div>
                    </div>

                    <div className=" w-[100%] 800px:w-[50%] mt-2">
                        <label htmlFor="newPassword" className="block pb-2">Enter your new password</label>
                        <div className="relative">
                            <input type={visible ? "text" : "password"} className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>                    
                    </div>

                    <div className=" w-[100%] 800px:w-[50%] mt-2">
                        <label htmlFor="confirmPassword" className="block pb-2">Confirm your new password</label>
                        <div className="relative">
                            <input type={visible ? "text" : "password"} className={`${styles.input} !w-[95%] mb-4 800px:mb-0 px-2`} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>                        
                        
                        <button className={`w-[95%] h-[40px] border border-[#3a24db] bg-[#3a24db] text-center text-white rounded-[3px] mt-8 cursor-pointer flex items-center justify-center`} type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <FiLoader  className="animate-spin" size={20}/>
                            ) : (
                                "Update"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Address = () => {
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("00000");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [addressType, setAddressType] = useState("");
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const addressTypeData = [
        {
            name: "Default",
        },
        {
            name: "Home",
        },
        {
            name: "Work",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (addressType === "" || country === "" || city === "") {
            toast.error("Please fill all the fields!");
        } else {
            dispatch(
                updateUserAddress( country, city, address1, address2, zipCode, addressType )
            );
            setOpen(false);
            setCountry("");
            setCity("");
            setAddress1("");
            setAddress2("");
            setZipCode(null);
            setAddressType("");
        }
    }

    const handleDelete = (item) => {
        const id = item._id;
        dispatch(deleteUserAddress(id));
    };

    return (
        <div className="w-full px-5">

            {open && (
                <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
                    <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
                        <div className="w-full flex justify-end p-3">
                            <RxCross1 size={30}className="cursor-pointer" onClick={() => setOpen(false)}/>  
                        </div>
                        <h1 className="text-center text-[25px] font-Poppins">
                            Add New Address
                        </h1>
                        <div className="w-full">
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="w-full block p-4">
                                    <div className="w-full pb-2">
                                        <label htmlFor="country" className="block pb-2">Country</label>
                                        <select required name="" id="" value={country} onChange={(e) => setCountry(e.target.value)} className="w-[95%] border h-[40px] rounded-[5px] px-2" >
                                            <option value="" className="block border pb-2 text-gray-500">
                                                Choose your Country
                                            </option>
                                            {Country && Country.getAllCountries().map((item) => (
                                                <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="city" className="block pb-2">City</label>
                                        <select required name="" id="" value={city} onChange={(e) => setCity(e.target.value)} className="w-[95%] border h-[40px] rounded-[5px] px-2" >
                                            <option value="" className="block border pb-2 text-gray-500">
                                                Choose your City
                                            </option>
                                            {State && State.getStatesOfCountry(country).map((item) => (
                                                <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="address1" className="block pb-2">Address 1</label>
                                        <input type="address" className={`${styles.input} px-2`} required value={address1} onChange={(e) => setAddress1(e.target.value)} />
                                    </div>
                                    <div className="w-full pb-2">
                                        <label htmlFor="address2" className="block pb-2">Address 2</label>
                                        <input type="address" className={`${styles.input} px-2`} required value={address2} onChange={(e) => setAddress2(e.target.value)} />
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="zipCode" className="block pb-2">Zip Code</label>
                                        <input type="number" className={`${styles.input} px-2`} required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                                    </div>

                                    <div className="w-full pb-2">
                                        <label htmlFor="addressType" className="block pb-2">Address Type</label>
                                        <select required name="" id="" value={addressType} onChange={(e) => setAddressType(e.target.value)} className="w-[95%] border h-[40px] rounded-[5px] px-2" >
                                            <option value="" className="block border pb-2 text-gray-500">
                                                Choose your Address Type
                                            </option>
                                            {addressTypeData &&
                                                addressTypeData.map((item) => (
                                                <option className="block pb-2" key={item.name} value={item.name}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className=" w-full pb-2">
                                        <input type="submit" className={`${styles.input} mt-5 cursor-pointer bg-black text-white`} required readOnly />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex w-full items-center justify-between">
                <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">My Addresses</h1>
                <div className={`${styles.button} !rounded-md`} onClick={() => setOpen(true)}>
                    <span className="text-[#fff]">Add New</span>
                </div>
            </div>
            <br />
            {user?.addresses.map((item, index) => (
                <div className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5" key={index}>
                    <div className="flex items-center">
                        <h5 className="pl-5 font-[600]">{item.addressType}</h5>
                    </div>
                    <div className="pl-8 flex items-center">
                        <h6 className="text-[12px] 800px:text-[unset]">
                            {item.address1}, {item.address2}
                        </h6>
                    </div>
                    <div className="pl-8 flex items-center">
                        <h6 className="text-[12px] 800px:text-[unset]">
                            {user && user.phoneNumber}
                        </h6>
                    </div>
                    <div className="min-w-[10%] flex items-center justify-between pl-8">
                        <AiOutlineDelete size={25} className="cursor-pointer hover:text-red-600" onClick={() => handleDelete(item)}/>
                    </div>
                </div>
            ))}

            {user?.addresses.length === 0 && (
                <h5 className="text-center pt-8 text-[18px]">
                    You don&apos;t have any saved address!
                </h5>
            )}
        </div>
    )
}

export default ProfileContent