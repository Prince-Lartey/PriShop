import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi"

const DashboardMessages = () => {
    const { seller, isLoading } = useSelector((state) => state.seller);
    const [conversations, setConversations] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const getConversation = async () => {
            try {
                const response = await axios.get(`${server}/conversation/get-all-conversation-seller/${seller?._id}`,
                {
                    withCredentials: true,
                });
        
                setConversations(response.data.conversations);
            } catch (error) {
                // console.log(error);
            }
        };
        getConversation();
    }, [seller,]);

    return (
        <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
            <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>


            {conversations && conversations.map((item, index) => (
                <MessageList data={item} key={index} index={index} setOpen={setOpen}/>
            ))}

            {open && (
                <SellerInbox setOpen={setOpen} />
            )}
        </div>
    )
}

const MessageList = ({ data, index, setOpen}) => {
    const [user, setUser] = useState([]);
    const navigate = useNavigate();

    const handleClick = (id) => {
        navigate(`/dashboard-messages?${id}`);
        setOpen(true);
    };

    const [active, setActive] = useState(0);

    return (
        <div className={`w-full flex p-3 px-3 ${ active === index ? "bg-[#00000010]" : "bg-transparent" }  cursor-pointer`} onClick={(e) => setActive(index) || handleClick(data._id) }>
            <div className="relative">
                Beef
            </div>
        </div>
    )
}

const SellerInbox = ({ setOpen}) => {

    return (
        <div className="w-full min-h-full flex flex-col justify-between">
            <div className="w-full flex p-3 items-center justify-between bg-slate-200">
                <div className="flex">
                    <img src={`${userData?.avatar?.url}`} alt="" className="w-[60px] h-[60px] rounded-full" />
                    <div className="pl-3">
                        <h1 className="text-[18px] font-[600]">{userData?.name}</h1>
                        <h1>{activeStatus ? "Active Now" : ""}</h1>
                    </div>
                </div>
                <AiOutlineArrowRight size={20} className="cursor-pointer" onClick={() => setOpen(false)}/>
            </div>

            {/* messages */}
            <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
                
            </div>

            {/* send message input */}
            <form className="p-3 relative w-full flex justify-between items-center" onSubmit={sendMessageHandler}>
                <div className="w-[30px]">
                    <input type="file"  name="" id="image" className="hidden" onChange={handleImageUpload}/>
                    <label htmlFor="image">
                        <TfiGallery className="cursor-pointer" size={20} title="Add Image" />
                    </label>
                </div>
                <div className="w-full">
                    <input type="text" required placeholder="Enter your message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className={`${styles.input}`}/>
                    <input type="submit" value="Send" className="hidden" id="send" />
                    <label htmlFor="send">
                        <AiOutlineSend size={20} className="absolute right-4 top-5 cursor-pointer"/>
                    </label>
                </div>
            </form>
        </div>
    )
}

export default DashboardMessages