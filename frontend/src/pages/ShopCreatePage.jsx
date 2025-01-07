import { useNavigate } from "react-router-dom";
import ShopCreate from "../components/shop/ShopCreate.jsx"
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ShopCreatePage = () => {
    const navigate = useNavigate();
    const { isSeller, isLoading } = useSelector((state) => state.seller);

    useEffect(() => {
        if(isSeller === true){
            navigate(`/sdashboard`);
        }
    }, [isLoading, isSeller])

    return (
        <div>
            <ShopCreate />
        </div>
    )
}

export default ShopCreatePage