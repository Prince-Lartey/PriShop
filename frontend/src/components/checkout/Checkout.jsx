import { useNavigate } from "react-router-dom"
import styles from "../../styles/styles"
import { useSelector } from "react-redux";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
    const { user } = useSelector((state) => state.user);
    const { cart } = useSelector((state) => state.cart)
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [userInfo, setUserInfo] = useState(false);
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [zipCode, setZipCode] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [couponCodeData, setCouponCodeData] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const subTotalPrice = cart.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
    );

    const paymentSubmit = () => {
        if(address1 === "" || address2 === "" || zipCode === null || country === "" || city === ""){
            toast.error("Please fill your delivery address!")
        } else{
            const shippingAddress = {
                address1,
                address2,
                zipCode,
                country,
                city,
            };

            const orderData = {
                cart,
                totalPrice,
                subTotalPrice,
                discountPrice,
                shippingAddress,
                user,
            }

            // update local storage with the updated orders array
            localStorage.setItem("latestOrder", JSON.stringify(orderData));
            navigate("/payment");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = couponCode;

        await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
            const shopId = res.data.couponCode?.shopId;
            const couponCodeValue = res.data.couponCode?.value;

            if (res.data.couponCode !== null) {
                const isCouponValid = cart && cart.filter((item) => item.shopId === shopId);

                if (isCouponValid.length === 0) {
                    toast.error("Coupon code is not valid for this item");
                    setCouponCode("");
                } else {
                    const eligiblePrice = isCouponValid.reduce(
                        (acc, item) => acc + item.qty * item.discountPrice,
                        0
                    );

                    const discountPrice = (eligiblePrice * couponCodeValue) / 100;
                    setDiscountPrice(discountPrice);
                    setCouponCodeData(res.data.couponCode);
                    setCouponCode("");
                }
            }

            if (res.data.couponCode === null) {
                toast.error("Coupon code doesn't exists!");
                setCouponCode("");
            }
        })
    }

    const discountPercentage = couponCodeData ? discountPrice : "";

    const totalPrice = couponCodeData ? (subTotalPrice - discountPercentage).toFixed(2) : (subTotalPrice).toFixed(2);

    return (
        <div  className="w-full flex flex-col items-center py-8">
            <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
                <div className="w-full 800px:w-[65%]">
                    <ShippingInfo user={user} country={country} setCountry={setCountry} city={city} setCity={setCity} userInfo={userInfo} setUserInfo={setUserInfo} address1={address1} setAddress1={setAddress1} address2={address2} setAddress2={setAddress2} zipCode={zipCode} setZipCode={setZipCode}/>
                </div>
                <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
                    <CartData handleSubmit={handleSubmit} totalPrice={totalPrice} subTotalPrice={subTotalPrice} couponCode={couponCode} setCouponCode={setCouponCode} discountPercentage={discountPercentage}/>
                </div>
            </div>

            <div className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`} onClick={paymentSubmit}>
                <h5 className="text-white">Go to Payment</h5>
            </div>
        </div>
    )
}

const ShippingInfo = ({ user, country, setCountry, city, setCity, zipCode, setZipCode, userInfo, setUserInfo, address1, setAddress1, address2, setAddress2}) =>  {

    return (
        <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500]">Shipping Address</h5>
            <br />
            <form>
                <div className="w-full flex pb-4">
                    <div className="w-[50%]">
                        <label htmlFor="name" className="block pb-2">Full Name</label>
                        <input type="text" value={user && user.name} required className={`${styles.input} !w-[95%]`} />
                    </div>
                    <div className="w-[50%]">
                        <label htmlFor="email" className="block pb-2">Email Address</label>
                        <input type="email" value={user && user.email} required className={`${styles.input}`} />
                    </div>
                </div>

                <div className="w-full flex pb-4">
                    <div className="w-[50%]">
                        <label htmlFor="phoneNumber" className="block pb-2">Phone Number</label>
                        <input type="number" required value={user && user.phoneNumber} className={`${styles.input} !w-[95%]`} />
                    </div>
                    <div className="w-[50%]">
                        <label htmlFor="zipCode" className="block pb-2">Zip Code</label>
                        <input type="number" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className={`${styles.input}`} />
                    </div>
                </div>

                <div className="w-full flex pb-4">
                    <div className="w-[50%]">
                        <label htmlFor="country" className="block pb-2">Country</label>
                        <select className="w-[95%] border h-[40px] rounded-[5px]" value={country} onChange={(e) => setCountry(e.target.value)} >
                            <option className="block pb-2" value="">
                                Choose your country
                            </option>
                            {Country && Country.getAllCountries().map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-[50%]">
                        <label htmlFor="city" className="block pb-2">City</label>
                        <select className="w-[95%] border h-[40px] rounded-[5px]" value={city} onChange={(e) => setCity(e.target.value)} >
                            <option className="block pb-2" value="">
                                Choose your City
                            </option>
                            {State && State.getStatesOfCountry(country).map((item) => (
                                <option key={item.isoCode} value={item.isoCode}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="w-full flex pb-4">
                    <div className="w-[50%]">
                        <label htmlFor="address1" className="block pb-2">Address1</label>
                        <input type="address" required value={address1} onChange={(e) => setAddress1(e.target.value)} className={`${styles.input} !w-[95%]`} />
                    </div>
                    <div className="w-[50%]">
                        <label htmlFor="address2" className="block pb-2">Address2</label>
                        <input type="address" value={address2} onChange={(e) => setAddress2(e.target.value)} required className={`${styles.input}`} />
                    </div>
                </div>
            </form>

            <h5 className="text-[16px] cursor-pointer inline-block text-[#1b1bbe] hover:underline" onClick={() => setUserInfo(!userInfo)}>
                Click to choose from your saved addresses
            </h5>
            {userInfo && (
                <div>
                    {user && user.addresses.map((item, index) => (
                        <div className="w-full flex mt-2" key={index}>
                            <input type="checkbox" className="mr-3" value={item.addressType} onClick={() => setAddress1(item.address1) || setAddress2(item.address2) || setZipCode(item.zipCode) || setCountry(item.country) || setCity(item.city)}/>
                            <h2>{item.addressType}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const CartData = ({ handleSubmit, totalPrice, subTotalPrice, couponCode, setCouponCode, discountPercentage,}) =>  {

    return (
        <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
                <h5 className="text-[18px] font-[600]">GH₵ {subTotalPrice}</h5>
            </div>
            <br />
            
            <br />
            <div className="flex justify-between border-b pb-3">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
                <h5 className="text-[18px] font-[600]">
                - {discountPercentage ? "GH₵ " + discountPercentage.toString() : null}
                </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">GH₵ {totalPrice}</h5>
            <br />

            <form onSubmit={handleSubmit}>
                <input type="text" className={`${styles.input} h-[40px] pl-2`} placeholder="Coupoun code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} required />
                <input className={`w-full h-[40px] border bg-[#f7607c] hover:bg-[#f63b60] text-center text-white font-semibold rounded-[3px] mt-8 cursor-pointer`} required value="Apply code" type="submit" />
            </form>
        </div>
    )
}

export default Checkout