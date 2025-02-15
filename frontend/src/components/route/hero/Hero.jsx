import { Link } from "react-router-dom"
import styles from "../../../styles/styles"

const Hero = () => {
    return (
        <div className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.normalFlex}`} style={{ backgroundImage: "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-1.jpg)",}}>
            <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
                <h1 className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}>
                    Best Collection for <br /> All Products
                </h1>
                <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
                    Discover the best collection for all products, carefully curated to meet your needs. <br />From high-quality electronics and trendy fashion  to home essentials and more,<br /> we offer a diverse range of top-rated items. Shop with confidence and find <br />everything you need in one place! 
                </p>
                <Link to="/products" className="inline-block">
                    <div className={`${styles.button} mt-5`}>
                        <span className="text-[#fff] font-[Poppins] text-[18px]">
                            Shop Now
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Hero