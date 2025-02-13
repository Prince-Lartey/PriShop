import { Link } from "react-router-dom"
import { backend_url } from "../../server.js"
import styles from "../../styles/styles"
import CountDown from "./CountDown.jsx"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addTocart } from "../../redux/actions/cart.js"

const EventCard = ({ active, data }) => {
    const { cart } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addToCartHandler = (id) => {
        const isItemExists = cart?.find((item) => item._id === id);
        if (isItemExists) {
            toast.error("Item already in cart!");
            return
        }

        if (data.stock < 1) {
            toast.error("Product stock limited!");
            return
        } 

        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
    };

    return (
        <div className={`w-full block bg-white rounded-lg ${active ? "unset" : "mb-12"} lg:flex p-2`}>
            <div className="w-full lg:-w[50%] m-auto">
                <img src={`${data.images[0].url}`} alt="" />
            </div>

            <div className="w-full lg:[w-50%] flex flex-col justify-center">
                <h2 className={`${styles.productTitle}`}>{data.name}</h2>
                <p>{data.description}</p>

                <div className="flex py-2 justify-between">
                    <div className="flex">
                        <h5 className="font-bold text-[20px] text-[#333] pr-3 font-Roboto">
                            ₵ {data.discountPrice}
                        </h5>
                        <h5 className="font-[500] text-[18px] text-[#d55b45] line-through">
                            GH₵ {data.originalPrice}
                        </h5>
                    </div>
                    <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
                        {data.sold_out} Sold
                    </span>
                </div>
                <CountDown data={data}/>
                <br />

                <div className="flex items-center">
                    <Link to={`/product/${data._id}?isEvent=true`}>
                        <div className={`${styles.button} text-[#fff]`}>See Details</div>
                    </Link>
                    <div className={`${styles.button} text-[#fff] ml-5`} onClick={() => addToCartHandler(data)}>Add to cart</div>
                </div>
            </div>
        </div>
    )
}

export default EventCard