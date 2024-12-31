import Header from "../components/layout/Header"
import Hero from "../components/route/hero/Hero"
import Categories from "../components/route/categories/Categories"
import BestDeals from "../components/route/bestDeals/BestDeals"
import FeaturedProduct from "../components/route/featuredProduct/FeaturedProduct";
import Events from "../components/events/Events"
import Sponsored from "../components/route/Sponsored"
import Footer from "../components/layout/Footer.jsx"

const HomePage = () => {
    return (
        <div>
            <Header activeHeading={1} />
            <Hero />
            <Categories />
            <BestDeals />
            <Events />
            <FeaturedProduct />
            <Sponsored />
            <Footer />
        </div>
    )
}

export default HomePage