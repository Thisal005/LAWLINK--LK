import Messages from "../messages/Mesasges";
import MessageInput from "../messages/MessageInput";

const MessageContainer = () => {
    return (
        <div className="flex flex-col h-[calc(110vh-100px)] w-295 bg-white shadow-md rounded-lg overflow-hidden mx-4 my-6">
            {/* Messages container with scroll */}
            <div className="flex-1 overflow-y-auto p-6">
                <Messages />
            </div>
            {/* Fixed input at bottom */}
            <div className="border-t border-gray-300 p-4 bg-white">
                <MessageInput />
            </div>
        </div>
    );
};

export default MessageContainer;
