import { useEffect, useState } from "react"
import { productData } from "../../static/data";
import styles from "../../styles/styles";
import ProductCard from "../route/productCard/ProductCard";
import { useSelector } from "react-redux";

const SuggestedProduct = ({data}) => {
    const [productData, setproductData] = useState()
    const { allProducts } = useSelector((state) => state.products)

    useEffect(() => {
        const d = allProducts && allProducts.filter((i) => i.category === data.category);
        setproductData(d);
    }, []);

    return (
        <div>
            {data ? (
                <div className={`p-4 ${styles.section}`}>
                    <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>Related Product</h2>
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                        {
                            productData && productData.map((i,index) => (
                                <ProductCard data={i} key={index} />
                            ))
                        }
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default SuggestedProduct