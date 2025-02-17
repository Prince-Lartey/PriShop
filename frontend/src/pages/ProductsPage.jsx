import { useSearchParams } from "react-router-dom"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import ProductCard from "../components/route/productCard/ProductCard"
import styles from "../styles/styles"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllProducts } from "../redux/actions/product"
import Loader from "../components/layout/Loader"

const ProductsPage = () => {
    const [searchParams] = useSearchParams();
    const categoryData = searchParams.get("category");
    const { allProducts, isLoading } = useSelector((state) => state.products);
    const [data, setData] = useState([]);
    const dispatch = useDispatch()

    useEffect(() => {
        // Fetch products when the component mounts
        if (!allProducts) {
            dispatch(getAllProducts());
        }
    }, [dispatch, allProducts]);

    useEffect(() => {
        if (allProducts) {
            if (!categoryData) {
                setData([...allProducts]);
            } else {
                const filteredProducts = allProducts.filter(
                    (product) => product.category === categoryData
                );
                setData(filteredProducts);
            }
        }
        window.scrollTo(0,0);
    }, [allProducts, categoryData]);

    return (
        <>
            {
                isLoading ? (
                    <Loader />
                ) : (
                <div>
                    <Header activeHeading={3} />
                    <br />
                    <br />
                    <div className={`${styles.section}`}>
                        {data.length > 0 ? (
                            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                                {data.map((product) => (
                                    <ProductCard data={product} key={product.id} />
                                ))}
                            </div>
                        ) : (
                            <div className="w-full text-center pb-[100px] pt-[50px]">
                                <h1 className="text-[20px]">No products Found!</h1>
                            </div>
                        )}
                    </div>
                    <Footer />
                </div>
                )
            }
        </>
    )
}

export default ProductsPage