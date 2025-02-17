import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";


const ProductDetailsCard = ({ setOpen, data }) => {
    const { cart } = useSelector((state) => state.cart)
    const { wishlist } = useSelector((state) => state.wishlist);
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    // const [select, setSelect] = useState(false )

    const dispatch = useDispatch();

    useEffect(() => {
        if (wishlist?.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist]);

    const removeFromWishlistHandler = (data) => {
            setClick(!click);
            dispatch(removeFromWishlist(data));
        };
        
        const addToWishlistHandler = (data) => {
            setClick(!click);
            dispatch(addToWishlist(data));
        };

    const handleMessageSubmit = () => {}

    const incrementCount = () => {
        setCount(count + 1)
    }

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1)
        }
    }

    const addToCartHandler = (id) => {
        const isItemExists = cart?.find((item) => item._id === id);
        if (isItemExists) {
            toast.error("Item already in cart!");
            return
        }

        if (data.stock < count) {
            toast.error("Product stock limited!");
            return
        } 

        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
    };

    return (
        <div className="bg-[#fff]">
            {data ? (
                <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
                    <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
                        <RxCross1 size={30} className="absolute right-3 top-3 z-50" onClick={() => setOpen(false)}/>

                        <div className="block w-full 800px:flex">
                            <div className="w-full 800px:w-[50%] mr-3">
                                <img src={`${data.images[0].url}`} alt="" className="mb-2"/>
                                <div className="flex">
                                    <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                                        <img src={`${data.shop.avatar?.url}`} alt="" className="w-[50px] h-[50px] rounded-full mr-2"/>

                                        <div>
                                            <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                                            <h5 className="pb-3 text-[15px]">{data.shop.ratings} Ratings</h5>
                                        </div>
                                    </Link>
                                </div>

                                <div className={`${styles.button} bg-[#000] mt-4 rounded-[4px] h-11`} onClick={handleMessageSubmit}>
                                    <span className="text-[#fff] flex items-center">
                                        Send Message <AiOutlineMessage className="ml-1" />
                                    </span>
                                </div>
                            </div>

                            <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                                <h1 className={`${styles.productTitle} text-[20px] mb-2`}>{data.name}</h1>
                                <p>{data.description}</p>

                                <div className="flex justify-between">
                                    <div className='flex pt-3'>
                                        <h4 className={`${styles.productDiscountPrice}`}>
                                            GH₵ {data.discountPrice}
                                        </h4>
                                        <h3 className={`${styles.price}`}>
                                            {data.originalPrice ? "₵ " + data.originalPrice : null}
                                        </h3>
                                    </div>
                                    <span className={`pt-3 font-[500] text-[20px] ${data.stock === 0 ? "text-red-500" : "text-[#68d284]"}`}>
                                        {data.stock === 0 ? "Sold Out" : `${data?.sold_out} sold`}
                                    </span>
                                </div>

                                <div className="flex items-center mt-12 justify-between pr-3">
                                    <div>
                                        <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out" onClick={decrementCount}>-</button>

                                        <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                                            {count}
                                        </span>

                                        <button className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out" onClick={incrementCount}>
                                            +
                                        </button>
                                    </div>

                                    <div>
                                        { click ? ( <AiFillHeart
                                            size={30}
                                            className="cursor-pointer"
                                            onClick={() => removeFromWishlistHandler(data)}
                                            color={click ? "red" : "#333"}
                                            title="Remove from wishlist"/>
                                        ) : (
                                        <AiOutlineHeart
                                            size={30}
                                            className="cursor-pointer"
                                            onClick={() => addToWishlistHandler(data)}
                                            title="Add to wishlist"
                                        />
                                        )}
                                    </div>
                                </div>

                                <div className={`${styles.button} !mt-6 !rounded-[4px] !h-11 flex items-center ${data.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => data.stock > 0 && addToCartHandler(data._id)}>
                                    <span className="text-[#fff] flex items-center">
                                        Add to cart <AiOutlineShoppingCart className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null }
        </div>
    )
}

export default ProductDetailsCard