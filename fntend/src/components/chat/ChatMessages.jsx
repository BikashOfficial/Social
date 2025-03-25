import React from 'react';
import { getProfilePhotoUrl, handleImageError } from '../../utils/imageUtils';

const ChatMessages = ({ messages, user, selectedFriend, isTyping, messagesEndRef }) => {
    // Debug log to check messages structure
    console.log('Messages:', messages);
    console.log('User ID:', user?._id);
    
    const getSenderId = (sender) => {
        if (typeof sender === 'object' && sender !== null) {
            return String(sender._id || sender.id || '');
        }
        return String(sender || '');
    };
    
    return (
        <div className="h-[calc(100vh-9rem)] md:h-[calc(100vh-14rem)] w-full overflow-y-auto px-2 sm:px-4 py-2 bg-gray-50">
            <div className="flex flex-col gap-3 min-h-full w-full">
                {messages && messages.length > 0 ? messages.map(message => {
                    const userId = String(user?._id);
                    const messageSenderId = getSenderId(message.sender);
                    const isCurrentUserSender = messageSenderId === userId;
                    
                    return (
                        <div 
                            key={message._id}
                            className={`flex items-end gap-2 w-full ${isCurrentUserSender ? 'justify-end' : 'justify-start'}`}
                        >
                            {!isCurrentUserSender && (
                                <div className="flex-shrink-0">
                                    <img 
                                        src={getProfilePhotoUrl(selectedFriend)}
                                        className="rounded-full w-8 h-8 mb-1"
                                        alt={selectedFriend?.username || "Friend"}
                                        onError={handleImageError}
                                    />
                                </div>
                            )}
                            <div 
                                className={`rounded-2xl py-2 px-4 max-w-[70%] shadow-sm ${
                                    isCurrentUserSender 
                                    ? 'bg-blue-500 text-white rounded-tr-none' 
                                    : 'bg-white border border-gray-100 rounded-tl-none'
                                }`}
                            >
                                {message.text}
                                <div className={`text-xs mt-1 ${isCurrentUserSender ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {message.createdAt && (
                                        new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })
                                    )}
                                </div>
                            </div>
                            {isCurrentUserSender && (
                                <div className="flex-shrink-0">
                                    <img 
                                        src={getProfilePhotoUrl(user)}
                                        className="rounded-full w-8 h-8 mb-1"
                                        alt={user?.username || "You"}
                                        onError={handleImageError}
                                    />
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="flex items-center justify-center h-full w-full">
                        <div className="text-center text-gray-500 py-4">
                            <p className="text-lg">No messages yet.</p>
                            <p className="text-sm mt-1">Start a conversation!</p>
                        </div>
                    </div>
                )}
                {isTyping && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm w-full">
                        <div className="flex-shrink-0">
                            <img 
                                src={getProfilePhotoUrl(selectedFriend)}
                                className="rounded-full w-6 h-6"
                                alt={selectedFriend?.username || "Friend"}
                                onError={handleImageError}
                            />
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span>Typing...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatMessages; 