import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({data}) => {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(data.finish_Date));

    useEffect(() => {
        const timer = setInterval(() => {
            const updatedTime = calculateTimeLeft(data.finish_Date);
            setTimeLeft(updatedTime);

            // If the countdown is finished, delete the event
            if (Object.keys(updatedTime).length === 0) {
                clearInterval(timer);
                deleteEvent();
            }
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval when component unmounts
    }, [data.finish_Date]); // Run only when finish_Date changes

    async function deleteEvent() {
        try {
            await axios.delete(`${server}/event/delete-shop-event/${data._id}`);
            console.log("Event deleted successfully");
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    }

    function calculateTimeLeft(finishDate) {
        const difference = new Date(finishDate) - new Date();
        if (difference <= 0) return {}; // If time is up, return an empty object

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return (
        <div>
            {Object.keys(timeLeft).length > 0 ? (
                Object.keys(timeLeft).map((interval, index) => (
                    <span key={index} className="text-[25px] text-[#475ad2]">
                        {timeLeft[interval]} {interval}{" "}
                    </span>
                ))
            ) : (
                <span className="text-[red] text-[25px]">Time’s Up</span>
            )}
        </div>
    );
};


export default CountDown