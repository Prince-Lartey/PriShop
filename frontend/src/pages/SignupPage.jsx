import { useNavigate } from "react-router-dom";
import Signup from "../components/signUp/Signup"
import { useSelector } from "react-redux";
import { useEffect } from "react";


const SignupPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state) => state.user);

    // If a user is already logged in and tries to go to the sign up page, he is redirected to homepage
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
    })

    return (
        <div>
            <Signup />
        </div>
    )
}

export default SignupPage