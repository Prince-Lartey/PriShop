import axios from "axios";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { FiLoader } from "react-icons/fi";

const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (activation_token) {
            const sendRequest = async () => {
                await axios.post(`${server}/shop/activation`, {activation_token,})
                    .then((res) => {console.log(res); setSuccess(true)})
                    .catch((error) => {setError(true); console.error("Activation error:", error.response ? error.response.data : error.message);});
            };
            sendRequest();
        }
    }, [activation_token]);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",}}>
            {success && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            {error ? ( <p>Your token is expired!</p>) : success ? (<p>Your account has been created successfully!</p>) : (<p><FiLoader size={50} className="animate-spin" /></p>)}
        </div>
    )
}

export default SellerActivationPage