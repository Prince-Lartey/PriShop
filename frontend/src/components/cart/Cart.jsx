import { RxCross1 } from "react-icons/rx"
import styles from "../../styles/styles"
import { IoBagHandleOutline } from "react-icons/io5";
import { useState } from "react";
import { HiOutlineMinus, HiPlus } from "react-icons/hi"
import shoe from "../../assets/bestdeal/shoe.jpg"
import { Link } from "react-router-dom";

const Cart = ({ setOpenCart }) => {
    const cartData = [
        {
            name: "Shoe for men, size 43 open, color brown",
            description: "test",
            price: 1000
        },
        {
            name: "Shoe for men, size 43 open, color brown",
            description: "test",
            price: 450
        },
        {
            name: "Shoe for men, size 43 open, color brown",
            description: "test",
            price: 800
        },
    ]

    return (
        <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
            <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-sm">
                <div>
                    <div className="flex w-full justify-end pt-5 pr-5">
                        <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)}/>
                    </div>

                    {/* Item length */}
                    <div className={`${styles.normalFlex} p-4`}>
                        <IoBagHandleOutline size={25} />
                        <h5 className="pl-2 text-[20px] font-[500]">
                            {cartData && cartData.length} items
                        </h5>
                    </div>

                    {/* cart Single Items */}
                    <br />
                    <div className="w-full border-t">
                        {cartData && cartData.map((i, index) => (
                            <CartSingle key={index} data={i} />
                        ))}
                    </div>
                </div>

                <div className="px-5 mb-3">
                    {/* checkout buttons */}
                    <Link to="/checkout">
                        <div className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`} >
                            <h1 className="text-[#fff] text-[18px] font-[600]">
                                Checkout Now (GH₵5000)
                            </h1>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

const CartSingle = ({ data }) => {
    const [value, setValue] = useState(1);
    const totalPrice = data.price * value;

    return (
        <div className="border-b p-4">
            <div className="w-full flex items-center">
                <div>
                    <div className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.normalFlex} justify-center cursor-pointer`} onClick={() => setValue(value + 1)}>
                        <HiPlus size={18} color="#fff" />
                    </div>

                    <span className="pl-[10px]">{value}</span>

                    <div className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer" onClick={() => setValue(value === 1 ? 1 : value - 1)}>
                        <HiOutlineMinus size={16} color="#7d879c" />
                    </div>
                </div>

                <img src={shoe} alt="" className="w-[80px] h-[80px] ml-2 mr-2"/>

                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    <h4 className="font-[400] text-[15px] text-[#00000082]">
                        ₵{data.price} * {value}
                    </h4>
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
                        GH₵{totalPrice}
                    </h4>
                </div>
                <RxCross1 className="cursor-pointer"/>
            </div>
        </div>
    )
}

export default Cart