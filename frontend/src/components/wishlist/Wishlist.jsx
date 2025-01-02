import { RxCross1 } from "react-icons/rx"
import styles from "../../styles/styles"
import { IoBagHandleOutline } from "react-icons/io5";
import { useState } from "react";
import shoe from "../../assets/bestdeal/shoe.jpg"
import { Link } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai";

const WishList = ({ setOpenWishlist }) => {
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
                        <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenWishlist(false)}/>
                    </div>

                    {/* Item length */}
                    <div className={`${styles.normalFlex} p-4`}>
                        <AiOutlineHeart size={25} />
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
            </div>
        </div>
    )
}

const CartSingle = ({ data }) => {
    const [value, setValue] = useState(1);
    const totalPrice = data.price * value;

    return (
        <div className="border-b p-4">
            <div className="w-full 800px:flex items-center">
                <RxCross1 className="cursor-pointer"/>
                <img src={shoe} alt="" className="w-[80px] h-[80px] ml-2 mr-2"/>

                <div className="pl-[5px]">
                    <h1>{data.name}</h1>
                    
                    <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
                        GH₵{totalPrice}
                    </h4>
                </div>
                <div>
                    <BsCartPlus size={20} className="cursor-pointer" title="Add to cart"/>
                </div>
            </div>
        </div>
    )
}

export default WishList