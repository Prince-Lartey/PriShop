import { Slide, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; 
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage } from '../Routes'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from 'react';
import Store from "./redux/store"
import { loadUser } from "./redux/actions/user";
import { useSelector } from 'react-redux';

const App = () => {
    const { loading } = useSelector((state) => state.user);

    useEffect(() => {
        Store.dispatch(loadUser());
    }, [])

    return (
        <>
            {
                loading ? (
                    null
                ) : (
                    <BrowserRouter>
                        <Routes>
                            <Route path='/' element={<HomePage />}/>
                            <Route path='/login' element={<LoginPage />}/>
                            <Route path='/sign-up' element={<SignupPage />}/>
                            <Route path='/activation/:activation_token' element={<ActivationPage />}/>
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/product/:name" element={<ProductDetailsPage />} />
                            <Route path="/best-selling" element={<BestSellingPage />} />
                            <Route path="/events" element={<EventsPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                        <ToastContainer position="top-center" autoClose={10000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Slide} />        
                    </BrowserRouter>
                )
            }
        </>
    )
}

export default App