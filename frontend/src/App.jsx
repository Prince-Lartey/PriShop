import { Slide, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"; 
import { LoginPage, SignupPage, ActivationPage, HomePage, ProductsPage, BestSellingPage, EventsPage, FAQPage, ProductDetailsPage, ProfilePage, CheckoutPage, ShopCreatePage, SellerActivationPage, ShopLoginPage, PaymentPage, OrderSuccessPage, OrderDetailsPage, TrackOrderPage } from './Routes/Routes.js'
import { ShopDashboardPage, ShopCreateProduct, ShopAllProducts, ShopCreateEvents, ShopAllEvents, ShopAllCoupons, ShopPreviewPage, ShopAllOrders, ShopOrderDetails, ShopAllRefunds, ShopSettingsPage } from './Routes/ShopRoutes.js';
import { ShopHomePage } from "./ShopRoutes.js";
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect } from 'react';
import Store from "./redux/store"
import { loadSeller, loadUser } from "./redux/actions/user";
import ProtectedRoute from "./Routes/ProtectedRoute.jsx"
import SellerProtectedRoute from './Routes/SellerProtectedRoute.jsx';
import { getAllProducts } from './redux/actions/product.js';
import { getAllEvents } from './redux/actions/event.js';

const App = () => {

    useEffect(() => {
        Store.dispatch(loadUser());
        Store.dispatch(loadSeller());
        Store.dispatch(getAllProducts());
        Store.dispatch(getAllEvents())
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />}/>
                <Route path='/login' element={<LoginPage />}/>
                <Route path='/sign-up' element={<SignupPage />}/>
                <Route path='/activation/:activation_token' element={<ActivationPage />}/>
                <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />}/>
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/best-selling" element={<BestSellingPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <CheckoutPage />
                    </ProtectedRoute>
                }/>
                <Route path="/order/success" element={<OrderSuccessPage />} />
                <Route path="/payment" element={
                    <ProtectedRoute>
                        <PaymentPage />
                    </ProtectedRoute>
                }/>
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="/user/order/:id" element={
                    <ProtectedRoute>
                        <OrderDetailsPage />
                    </ProtectedRoute>
                }/>
                <Route path="/user/track/order/:id" element={
                    <ProtectedRoute>
                        <TrackOrderPage />
                    </ProtectedRoute>
                }/>
                <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />

                {/* Shop Routes */}
                <Route path="/shop-create" element={<ShopCreatePage />} />
                <Route path="/shop-login" element={<ShopLoginPage />} />
                <Route path="/shop/:id" element={
                    <SellerProtectedRoute>
                        <ShopHomePage />
                    </SellerProtectedRoute>
                }/>
                <Route path="/settings" element={
                    <SellerProtectedRoute>
                        <ShopSettingsPage />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard" element={
                    <SellerProtectedRoute>
                        <ShopDashboardPage />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard-create-product" element={
                    <SellerProtectedRoute>
                        <ShopCreateProduct />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard-orders" element={
                    <SellerProtectedRoute>
                        <ShopAllOrders />
                    </SellerProtectedRoute>
                }/>

                <Route path="/dashboard-refunds" element={
                    <SellerProtectedRoute>
                        <ShopAllRefunds />
                    </SellerProtectedRoute>
                }/>
                <Route path="/order/:id" element={
                    <SellerProtectedRoute>
                        <ShopOrderDetails />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard-products" element={
                    <SellerProtectedRoute>
                        <ShopAllProducts />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard-create-event" element={
                    <SellerProtectedRoute>
                        <ShopCreateEvents />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard-events" element={
                    <SellerProtectedRoute>
                        <ShopAllEvents />
                    </SellerProtectedRoute>
                }/>
                <Route path="/dashboard-coupons" element={
                    <SellerProtectedRoute>
                        <ShopAllCoupons />
                    </SellerProtectedRoute>
                }/>
            </Routes>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" transition={Slide} />        
        </BrowserRouter>
    )
}

export default App