import { useSelector } from "react-redux";
import Login from "../components/login/Login"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state) => state.user);

    // If a user is already logged in and tries to go to the login page, he is redirected to homepage
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/")
        }
    })

    return (
        <div>
            <Login />
        </div>
    )
}

export default LoginPage