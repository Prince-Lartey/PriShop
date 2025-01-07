import { useNavigate } from "react-router-dom";
import ShopLogin from "../components/shop/ShopLogin.jsx"
import { useSelector } from "react-redux";
import { useEffect } from "react";

const ShopLoginPage = () => {
    const navigate = useNavigate();
    const { isSeller, isLoading } = useSelector((state) => state.seller);

    useEffect(() => {
        if(isSeller === true){
            navigate(`/dashboard`);
        }
    }, [isLoading, isSeller])

    return (
        <div>
            <ShopLogin />
        </div>
    )
}

export default ShopLoginPage