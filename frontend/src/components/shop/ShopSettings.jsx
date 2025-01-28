import React, { useState } from 'react'
import { AiOutlineCamera } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { backend_url, server } from '../../server';
import styles from '../../styles/styles';
import axios from 'axios';
import { toast } from 'react-toastify';
import { loadSeller } from '../../redux/actions/user';

const ShopSettings = () => {
    const { seller } = useSelector((state) => state.seller);
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState(seller && seller.name);
    const [email, setEmail] = useState(seller && seller.email);
    const [description, setDescription] = useState(seller && seller.description ? seller.description : "");
    const [address, setAddress] = useState(seller && seller.address);
    const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
    const [zipCode, setZipCode] = useState(seller && seller.zipCode);
    const [password, setPassword] = useState()

    const dispatch = useDispatch();

    const handleImage = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;
    
            setAvatar(file);
    
            const formData = new FormData();
            formData.append("image", file);
    
            await axios.put(`${server}/shop/update-shop-avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
    
            dispatch(loadSeller())
            toast.success("Avatar updated successfully!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update avatar");
            console.error(error);
        }
    }

    const updateHandler = async (e) => {
        e.preventDefault();
    
        await axios.put(`${server}/shop/update-seller-info`,
            {
                name,
                email: seller.email,
                address,
                zipCode,
                phoneNumber,
                description,
                password,
            },
            { withCredentials: true }
        )
        .then((res) => {
            toast.success("Shop info updated succesfully!");
            dispatch(loadSeller());
        })
        .catch((error) => {
            toast.error(error.response.data.message);
        });
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center">
            <div className="flex w-full 800px:w-[80%] flex-col justify-center my-5">
                <div className="w-full flex items-center justify-center">
                    <div className="relative">
                        <img src={ avatar ? URL.createObjectURL(avatar) : `${backend_url}${seller.avatar.url}`} alt="" className="w-[200px] h-[200px] rounded-full cursor-pointer border-4 border-blue-500"/>
                        <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[15px]">
                            <input type="file"  id="image"  className="hidden"  onChange={handleImage}/>
                            <label htmlFor="image"> <AiOutlineCamera /></label>
                        </div>
                    </div>
                </div>

                <form className="flex flex-col items-center" onSubmit={updateHandler}>
                    <div className="w-full 800px:flex block 800px:pb-5">
                        <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                            <div className="w-full pl-[3%]">
                                <label htmlFor="shopName" className="block pb-1">Shop Name</label>
                            </div>
                            <input type="name" placeholder={`${seller.name}`} value={name} onChange={(e) => setName(e.target.value)} className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required />
                        </div>
                        <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                            <div className="w-full pl-[3%]">
                                <label htmlFor="description" className="block pb-1">Shop Email</label>
                            </div>
                            <input type="name" placeholder={`${ seller?.email ? seller.email : "Enter your shop description"}`} value={email}  onChange={(e) => setEmail(e.target.value)} readOnly disabled className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}/>
                        </div>
                    </div>

                    <div className="w-full 800px:flex block 800px:pb-5">
                        <div className="w-[100%] flex items-center flex-col">
                            <div className="w-full pl-[1.5%]">
                                <label htmlFor="description" className="block pb-1">Shop Description</label>
                            </div>
                            <textarea rows={10} type="name" placeholder={`${ seller?.description ? seller.description : "Enter your shop description"}`} value={description}  onChange={(e) => setDescription(e.target.value)} className={`${styles.input} !w-[97%] mb-4 800px:mb-0`}/>
                        </div>
                    </div>

                    <div className="w-full 800px:flex block 800px:pb-5">
                        <div className="w-[100%] flex items-center flex-col 800px:w-[50%] ">
                            <div className="w-full pl-[3%]">
                                <label htmlFor="address" className="block pb-1">Shop Address</label>
                            </div>
                            <input type="name" placeholder={seller?.address} value={address} onChange={(e) => setAddress(e.target.value)} className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required />
                        </div>

                        <div className="w-[100%] flex items-center flex-col 800px:w-[50%]">
                            <div className="w-full pl-[3%]">
                                <label htmlFor="number" className="block pb-1">Shop Phone Number</label>
                            </div>
                            <input type="number" placeholder={seller?.phoneNumber} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required />
                        </div>
                    </div>

                    <div className="w-full 800px:flex block 800px:pb-5">
                        <div className="w-[100%] flex items-center flex-col 800px:w-[50%]">
                            <div className="w-full pl-[3%]">
                                <label htmlFor="zipCode" className="block pb-1">Shop Zip Code</label>
                            </div>
                            <input type="number" placeholder={seller?.zipCode} value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required />
                        </div>

                        <div className="w-[100%] flex items-center flex-col 800px:w-[50%]">
                            <div className="w-full pl-[3%]">
                                <label htmlFor="password" className="block pb-1">Enter your Password</label>
                            </div>
                            <input type="password" placeholder='********' onChange={(e) => setPassword(e.target.value)} className={`${styles.input} !w-[95%] mb-4 800px:mb-0`} required />
                        </div>
                    </div>

                    <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
                        <input type="submit" value="Update Shop" className={`${styles.input} !w-[50%] mb-4 800px:mb-0 bg-[#3a24db] text-white h-[40px] cursor-pointer`} required readOnly />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ShopSettings