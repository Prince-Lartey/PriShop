import axios from "axios";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (activation_token) {
            const sendRequest = async () => {
                await axios.post(`${server}/user/activation`, {activation_token,})
                    .then((res) => {console.log(res); setSuccess(true)})
                    .catch((error) => {setError(true); console.log(error)});
            };
            sendRequest();
        }
    }, [activation_token]);

    return (
        <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center",}}>
            {success && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            {error ? ( <p>Your token is expired!</p>) : success ? (<p>Your account has been created successfully!</p>) : (<p>Activating your account...</p>)}
        </div>
    )
}

export default ActivationPage