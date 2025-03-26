import React from 'react';

const MessageSkeleton = () => {
    // Randomly determine if the message is on the left or right
    const isLeft = Math.random() > 0.5;
    
    return (
        <div className={`flex mb-3 ${isLeft ? 'justify-start' : 'justify-end'}`}>
            <div 
                className={`animate-pulse max-w-[65%] p-3 rounded-2xl ${
                    isLeft 
                        ? 'bg-gray-200 rounded-bl-none' 
                        : 'bg-gray-200 rounded-br-none'
                }`}
            >
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="flex justify-end mt-2">
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                </div>
            </div>
        </div>
    );
};

export default MessageSkeleton;