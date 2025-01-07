import Lottie from "react-lottie";
import animationData from "../../assets/animations/Animation - 1736259918224.json"

const Loader = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <Lottie options={defaultOptions} width={300} height={300} />
        </div>
    )
}

export default Loader