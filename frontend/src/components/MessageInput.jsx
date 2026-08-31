import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

export const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage } = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreview(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!text.trim() && !imagePreview) return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview
            });

            setText("");
            setImagePreview(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("failed to send message ", error);
        }
    };

    return (
        <div className="p-2 w-full bg-[#c0c0c0]">

            {/* Image Preview */}
            {imagePreview && (
                <div className="mb-2 flex items-center gap-2">

                    <div className="relative">

                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover border-2 border-gray-600 border-t-black border-l-black"
                        />

                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-white border-r-black border-b-black"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>

                    </div>

                </div>
            )}

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

                    {/* Hidden File Input */}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                    />

                    {/* Image Button */}
                    <button
                        type="button"
                        className={`w-9 h-9 flex items-center justify-center bg-[#c0c0c0] border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white ${
                            imagePreview
                                ? "text-green-700"
                                : "text-black"
                        }`}
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >
                        <Image className="size-5" />
                    </button>

                </div>

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview}
                    className="w-9 h-9 flex items-center justify-center bg-[#c0c0c0] text-black border-2 border-white border-r-black border-b-black active:border-black active:border-r-white active:border-b-white disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    <Send className="size-4" />
                </button>

            </form>

        </div>
    );
};