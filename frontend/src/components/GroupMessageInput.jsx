import { useState } from "react";
import { Send} from "lucide-react";
import { useGroupChat } from "../store/useGroupChat";

export const GroupMessageInput = () => {
    const [text, setText] = useState("");
    const {sendGroupMessages} = useGroupChat();


    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim()) return;

        try {
            await sendGroupMessages({
                text: text.trim(),
            });

            setText("");

        } catch (error) {
            console.error("failed to send message ", error);
        }
    };

    return (
        <div className="p-2 w-full bg-[#c0c0c0]">

            {/* Message Form */}
            <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-1"
            >

                <div className="flex flex-1 gap-1">

                    {/* Text Input */}
                    <input
                        type="text"
                        className="flex-1 bg-white border-2 border-gray-600 border-t-black border-l-black px-2 py-2 text-sm text-black outline-none"
                        placeholder="Type a message..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="w-9 h-9 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    <Send className="size-4" />
                </button>

            </form>

        </div>
    );
};