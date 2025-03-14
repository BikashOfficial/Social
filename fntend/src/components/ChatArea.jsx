import React, { useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { socketService } from '../services/socketService';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import ChatMessages from './chat/ChatMessages';
import Header from '../components/Header';

const ChatArea = ({
    selectedFriend,
    user,
    messages,
    newMessage,
    setNewMessage,
    sendingMessage,
    handleSendMessage,
    handleTyping,
    isTyping,
    onlineUsers,
    lastSeen,
    setShowChat
}) => {
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const formatLastSeen = (userId) => {
        const lastSeenDate = lastSeen[userId];
        if (!lastSeenDate) return 'Offline';
        return `Last seen ${formatDistanceToNow(lastSeenDate, { addSuffix: true })}`;
    };

    return (
        <div>
            <div className="flex-1 flex flex-col bg-white h-screen relative">
            {selectedFriend ? (
                <>
                    <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
                        <ChatHeader
                            selectedFriend={selectedFriend}
                            onlineUsers={onlineUsers}
                            isTyping={isTyping}
                            setShowChat={setShowChat}
                            formatLastSeen={formatLastSeen}
                        />
                    </div>
                    <div className="flex-1 overflow-hidden pt-[72px] pb-[0px]">
                        <ChatMessages
                            messages={messages}
                            user={user}
                            selectedFriend={selectedFriend}
                            isTyping={isTyping}
                            messagesEndRef={messagesEndRef}
                        />
                    </div>
                    <div className="bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
                        <ChatInput
                            newMessage={newMessage}
                            handleTyping={handleTyping}
                            handleSendMessage={handleSendMessage}
                            sendingMessage={sendingMessage}
                        />
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                </div>
            )}
        </div>
        </div>
    );
};

export default ChatArea; 