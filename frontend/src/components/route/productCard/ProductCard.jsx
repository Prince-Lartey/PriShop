import { useState } from "react";
import { Link } from "react-router-dom";


const ProductCard = ({data}) => {
    const [click, setClick] = useState(false);
    const [open, setOpen] = useState(false);

    const d = data.name
    const product_name = d.replace(/\s+/g, "-")

    return (
        <>
            <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
                <div className="flex justify-end"></div>
                <Link to={`/product/${product_name}`}>
                    <img src={data.image_Url[0].url} alt="" className="w-full h-[170px] object-contain"/>
                </Link>
            </div>
        </>
    )
}

export default ProductCard