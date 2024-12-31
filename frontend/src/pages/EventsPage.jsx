import EventCard from "../components/events/EventCard"
import Header from "../components/layout/Header"

const EventsPage = () => {
    return (
        <div>
            <Header activeHeading={4} />
            <EventCard active={true} />
        </div>
    )
}

export default EventsPage