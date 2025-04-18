import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import dayjs from "dayjs";
import { Heart, ThumbsUp, Reply, MoreHorizontal, Trash, Download, Paperclip, Image } from "lucide-react";

const Message = ({ message, onReply, onDelete }) => {
    // Access user and backend data from context
    const { userData, lawyerData, backendUrl } = useContext(AppContext);

    // State to manage options visibility and reactions
    const [showOptions, setShowOptions] = useState(false);
    const [reaction, setReaction] = useState(message.reaction || null);
    const [reactionTime, setReactionTime] = useState(null);

    // Determine the current user ID and if the message is sent by the current user
    const currentUserId = userData?._id || lawyerData?._id || "defaultUserId";
    const isOwnMessage = message.senderId === currentUserId;

    // Format the message timestamp for display
    const formatTime = (time) => {
        const messageDate = dayjs(time);
        const today = dayjs();

        if (messageDate.isSame(today, 'day')) {
            return messageDate.format("h:mm A");
        }

        if (messageDate.isSame(today.subtract(1, 'day'), 'day')) {
            return "Yesterday, " + messageDate.format("h:mm A");
        }

        return messageDate.format("MMM D, h:mm A");
    };

    // Handle file download for attached documents
    const handleDownload = (messageId, documentIndex) => {
        window.open(`${backendUrl}/api/messages/download/${messageId}/${documentIndex}`, '_blank');
    };

    return (
        <div className={`group flex items-end mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
            {/* Display sender's avatar for messages not sent by the current user */}
            {!isOwnMessage && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2 overflow-hidden">
                    {message.senderAvatar ? (
                        <img 
                            src={message.senderAvatar} 
                            alt="Avatar" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold">
                            {message.senderName?.charAt(0) || "U"}
                        </div>
                    )}
                </div>
            )}

            {/* Message content container */}
            <div className="flex flex-col max-w-[70%]">
                {/* Display sender's name for messages not sent by the current user */}
                {!isOwnMessage && message.senderName && (
                    <span className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</span>
                )}

                {/* Message bubble */}
                <div
                    className={`relative px-4 py-2 rounded-2xl ${
                        isOwnMessage
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                    } shadow-sm`}
                    onMouseEnter={() => setShowOptions(true)} // Show options on hover
                    onMouseLeave={() => setShowOptions(false)} // Hide options on mouse leave
                >
                    {/* Display reply-to message if applicable */}
                    <div className="message-content text-sm whitespace-pre-wrap">
                        {message.replyTo && (
                            <div className={`text-xs p-1.5 mb-1.5 rounded border-l-2 ${
                                isOwnMessage ? "bg-blue-600 border-blue-300" : "bg-gray-200 border-gray-400"
                            }`}>
                                <p className="truncate">{message.replyTo.message}</p>
                            </div>
                        )}
                        {message.message}
                    </div>

                    {/* Display attached documents if any */}
                    {message.documents && message.documents.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {message.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        {/* Display appropriate icon based on file type */}
                                        {doc.mimetype.startsWith("image/") ? (
                                            <Image className="w-4 h-4 text-gray-400 mr-2" />
                                        ) : doc.mimetype === "application/pdf" ? (
                                            <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                                        ) : (
                                            <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                                        )}
                                        <span className="text-sm text-gray-700">{doc.originalname}</span>
                                    </div>
                                    {/* Download button for the document */}
                                    <button
                                        onClick={() => handleDownload(message._id, index)}
                                        className="p-1 rounded-full hover:bg-gray-100"
                                    >
                                        <Download className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Display message timestamp and status */}
                    <div className={`flex items-center text-xs mt-1 ${
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}>
                        {formatTime(message.createdAt)}
                        {isOwnMessage && (
                            <span className="ml-1">
                                {message.isPending ? (
                                    <span className="animate-spin">⟳</span> // Pending status
                                ) : (
                                    <>
                                        <span className={message.isDelivered ? "opacity-100" : "opacity-50"}>✓</span>
                                        {message.isRead && <span className="ml-0.5">✓</span>}
                                    </>
                                )}
                            </span>
                        )}
                    </div>

                    {/* Reaction and action buttons */}
                    {showOptions && (
                        <div className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} -top-8 bg-white shadow-md rounded-full p-1 flex gap-1`}>
                            {/* Like reaction */}
                            <button 
                                onClick={() => handleReaction('like')} 
                                className={`p-1 rounded-full hover:bg-gray-100 ${reaction === 'like' ? 'bg-blue-50 text-blue-500' : ''}`}
                            >
                                <ThumbsUp size={14} />
                            </button>
                            {/* Love reaction */}
                            <button 
                                onClick={() => handleReaction('love')} 
                                className={`p-1 rounded-full hover:bg-gray-100 ${reaction === 'love' ? 'bg-red-50 text-red-500' : ''}`}
                            >
                                <Heart size={14} />
                            </button>
                            {/* Reply button */}
                            <button 
                                onClick={() => onReply(message)} 
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <Reply size={14} />
                            </button>
                            {/* Delete button for own messages */}
                            {isOwnMessage && (
                                <button 
                                    onClick={() => onDelete(message._id)} 
                                    className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                                >
                                    <Trash size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
