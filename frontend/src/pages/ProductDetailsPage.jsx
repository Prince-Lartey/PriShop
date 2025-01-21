import { useEffect, useState } from "react";
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import ProductDetails from "../components/products/ProductDetails"
import { useParams, useSearchParams } from "react-router-dom";
import SuggestedProduct from "../components/products/SuggestedProduct"
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
    const { allProducts } = useSelector((state) => state.products)
    const { allEvents } = useSelector((state) => state.events)
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [searchParams] = useSearchParams();
    const eventData = searchParams.get("isEvent");
    
    useEffect(() => {
        if (eventData !== null) {
            const data = allEvents && allEvents.find((i) => i._id === id);
            setData(data);
        } else {
            const data = allProducts && allProducts.find((i) => i._id === id);
            setData(data);
        }
    }, [allProducts, allEvents]);

    return (
        <div>
            <Header />
            <ProductDetails data={data}/>
            {
                !eventData && (
                    <>
                        {data && <SuggestedProduct data={data} />}
                    </>
                )
            }
            <Footer />
        </div>
    )
}

export default ProductDetailsPage