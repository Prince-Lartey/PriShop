import { useEffect, useState } from "react";
import Footer from "../components/Layout/Footer"
import Header from "../components/layout/Header"
import ProductDetails from "../components/products/ProductDetails"
import { useParams } from "react-router-dom";
import { productData } from "../static/data";

const ProductDetailsPage = () => {
    const { name } = useParams();
    const [data, setData] = useState(null);
    const productName = name.replace(/-/g," ")

    useEffect(() => {
        const data = productData.find((i) => i.name === productName)
        setData(data)
    }, [])

    return (
        <div>
            <Header />
            <ProductDetails data={data}/>
            <Footer />
        </div>
    )
}

export default ProductDetailsPage