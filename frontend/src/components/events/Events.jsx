import styles from "../../styles/styles"
import EventCard from "./EventCard"

const Events = () => {
    return (
        <div>
            <div className={`${styles.section}`}>
                <div className={`${styles.heading}`}>
                    <h1>Popular Events</h1>
                </div>

                <EventCard />
            </div>
        </div>
    )
}

export default Events