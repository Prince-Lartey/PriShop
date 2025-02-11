import styles from "../../styles/styles"

const Sponsored = () => {
    return (
        <div className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl`}>
            <div className="flex justify-between w-full">
                <div className="flex items-start pt-5">
                    <img src="https://kantankaautomobile.com.gh/wp-content/uploads/2022/01/kantanka-automobile-logo-retina-1.png" alt="" style={{width:"150px", objectFit:"contain"}}/>
                </div>
                <div className="flex items-start">
                    <img src="https://uploads.files.3news.com/2024/05/Screenshot-267.png" style={{width:"150px", objectFit:"contain"}} alt=""/>
                </div>
                <div className="flex items-start pt-3">
                    <img src="https://melcomgroup.com/wp-content/uploads/2022/09/logo_withoutslogann_cropped.png" style={{width:"150px", objectFit:"contain"}} alt="" />
                </div>
                <div className="flex items-start">
                    <img src="https://marcopolis.net/wp-content/uploads/Ghana_Report/2020/companies/GOIL_Company_Limited.jpg" style={{width:"150px", objectFit:"contain"}} alt="" />
                </div>
                <div className="flex items-start">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png" style={{width:"150px", objectFit:"contain"}} alt=""/>
                </div>
            </div>
        </div>
    )
}

export default Sponsored
