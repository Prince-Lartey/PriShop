import CheckoutSteps from '../components/checkout/CheckoutSteps'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import Payment from "../components/payment/Payment.jsx";

const PaymentPage = () => {
    return (
        <div className='w-full min-h-screen bg-[#f6f9fc]'>
            <Header />
            <br />
            <br />
            <CheckoutSteps active={2} />
            <Payment />
            <br />
            <br />
            <Footer />
        </div>
    )
}

export default PaymentPage