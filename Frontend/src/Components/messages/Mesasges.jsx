import { useEffect, useRef, useState } from "react";
import Message from "../messages/Message";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import dayjs from "dayjs";

const Messages = () => {
  const { messages, loading, getMessages } = useGetMessages();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      await getMessages();
      setIsFirstLoad(false);
    };

    fetchMessages();

    const interval = setInterval(() => {
      getMessages();
    }, 15000);

    return () => clearInterval(interval);
  }, [getMessages]);

  useEffect(() => {
    if (!loading && messagesEndRef.current) {
      if (isFirstLoad) {
        messagesEndRef.current.scrollIntoView();
      } else {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, loading, isFirstLoad]);

  const groupedMessages = messages.reduce((groups, message) => {
    const date = dayjs(message.createdAt).format("MMMM D, YYYY");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-y-auto px-4 py-2">
      {loading && isFirstLoad ? (
        [...Array(3)].map((_, index) => <MessageSkeleton key={index} />)
      ) : messages.length > 0 ? (
        <>
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">{date}</span>
              </div>
              {dateMessages.map((message) => (
                <Message key={message._id || message.createdAt} message={message} />
              ))}
            </div>
          ))}
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500 bg-gray-50 p-4 rounded-lg">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;