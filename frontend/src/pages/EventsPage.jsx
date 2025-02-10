import { useSelector } from "react-redux"
import EventCard from "../components/events/EventCard"
import Footer from "../components/layout/Footer"
import Header from "../components/layout/Header"
import Loader from "../components/layout/Loader"

const EventsPage = () => {
    const { allEvents, isLoading } = useSelector((state) => state.events)

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <Header activeHeading={4} />
                    <div className="w-full flex flex-wrap gap-4 justify-center my-4">
                        {allEvents && allEvents.length > 0 ? (
                            allEvents.map((event) => (
                                <EventCard key={event._id} active={true} data={event} />
                            ))
                        ) : (
                            <p className="text-center text-lg font-semibold">No events available</p>
                        )}
                    </div>
                    <Footer />
                </div>
            )}
        </>
    )
}

export default EventsPage