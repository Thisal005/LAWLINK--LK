import { useEffect, useRef, useState } from "react";
import Message from "../messages/Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import dayjs from "dayjs";

const Messages = () => {
  // Custom hook to fetch messages and manage loading state
  const { messages, loading, getMessages } = useGetMessages();

  // Refs for scrolling and container
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // State to track if it's the first load
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Fetch messages on component mount and set up polling every 15 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      await getMessages();
      setIsFirstLoad(false); // Mark first load as complete
    };

    fetchMessages();

    // Poll for new messages every 15 seconds
    const interval = setInterval(() => {
      getMessages();
    }, 15000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [getMessages]);

  // Scroll to the bottom of the messages when new messages are loaded
  useEffect(() => {
    if (!loading && messagesEndRef.current) {
      if (isFirstLoad) {
        // Scroll instantly on first load
        messagesEndRef.current.scrollIntoView();
      } else {
        // Smooth scroll for subsequent updates
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, loading, isFirstLoad]);

  // Group messages by date for display
  const groupedMessages = Array.isArray(messages)
    ? messages.reduce((groups, message) => {
        const date = dayjs(message.createdAt).format("MMMM D, YYYY");
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
        return groups;
      }, {})
    : {};

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-y-auto px-4 py-2">
      {/* Show skeleton loaders during the first load */}
      {loading && isFirstLoad ? (
        [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)
      ) : messages.length > 0 ? (
        <>
          {/* Render grouped messages by date */}
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Display date as a separator */}
              <div className="flex justify-center my-4">
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{date}</span>
              </div>
              {/* Render individual messages */}
              {dateMessages.map((message) => (
                <Message key={message._id || message.createdAt} message={message} />
              ))}
            </div>
          ))}
        </>
      ) : (
        // Show a placeholder if there are no messages
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        </div>
      )}
      {/* Dummy div to scroll to the bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;