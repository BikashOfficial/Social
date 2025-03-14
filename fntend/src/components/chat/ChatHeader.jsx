import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getProfilePhotoUrl } from '../../utils/profileUtils';

const ChatHeader = ({ selectedFriend, onlineUsers, isTyping, setShowChat, formatLastSeen }) => {
    return (
        <div className="backdrop-blur-xl flex-none p-4 border-b border-gray-200">
            <div className="flex items-center">
                <button 
                    className="md:hidden mr-3 text-blue-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    onClick={() => setShowChat(false)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <div className="relative">
                    <img 
                        src={getProfilePhotoUrl(selectedFriend)}
                        className="rounded-full w-10 h-10 border border-gray-200"
                        alt={selectedFriend?.username || "Friend"}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                        }}
                    />
                    {onlineUsers.has(selectedFriend._id) && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="ml-3">
                    <span className="font-semibold">{selectedFriend.username}</span>
                    <p className="text-xs text-gray-500">
                        {onlineUsers.has(selectedFriend._id) 
                            ? isTyping ? 'Typing...' : 'Active now'
                            : formatLastSeen(selectedFriend._id)
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader; 