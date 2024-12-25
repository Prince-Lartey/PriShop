import Header from "../components/layout/Header"
import Hero from "../components/route/hero/Hero"
import Categories from "../components/route/categories/Categories"
import BestDeals from "../components/route/bestDeals/BestDeals"

const HomePage = () => {
    return (
        <div>
            <Header activeHeading={1} />
            <Hero />
            <Categories />
            <BestDeals />
        </div>
    )
}

export default HomePage