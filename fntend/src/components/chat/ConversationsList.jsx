import React from 'react';
import Sidebar from '../Sidebar';
import { getProfilePhotoUrl } from '../../utils/profileUtils';

const ConversationsList = ({ 
    friends, 
    selectedFriend, 
    selectFriend, 
    lastMessages, 
    unreadMessages, 
    onlineUsers, 
    user, 
    showChat 
}) => {
    return (
        <div className={`w-full md:w-[350px] bg-white border-r border-gray-200 ${showChat ? 'hidden md:block' : 'block'}`}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Messages</h2>
                </div>
                <div className="p-3 border-b border-gray-200">
                    <input
                        type="text"
                        placeholder="Search messages"
                        className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {friends.map(friend => {
                        const lastMsg = lastMessages[friend._id];
                        const unreadCount = unreadMessages[friend._id] || 0;
                        
                        return (
                            <div
                                key={friend._id}
                                onClick={() => selectFriend(friend)}
                                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                                    selectedFriend?._id === friend._id ? 'border-blue-500 bg-gray-50' : 
                                    unreadCount > 0 ? 'border-blue-300' : 'border-transparent'
                                }`}
                            >
                                <div className="relative">
                                    <img 
                                        src={getProfilePhotoUrl(friend)}
                                        className="rounded-full w-12 h-12 border border-gray-200"
                                        alt={friend.username || "Friend"}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                        }}
                                    />
                                    {onlineUsers.has(friend._id) && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                    {unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            {unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-center">
                                        <p className={`font-semibold ${unreadCount > 0 ? 'text-black' : 'text-gray-700'}`}>
                                            {friend.username}
                                        </p>
                                        {lastMsg && (
                                            <span className="text-xs text-gray-400">
                                                {new Date(lastMsg.createdAt).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <p className={`text-sm truncate ${
                                            unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                                        }`}>
                                            {lastMsg?.text || 'No messages yet'}
                                        </p>
                                        {lastMsg?.sender === user._id && (
                                            <span className="text-xs text-blue-500">
                                                {lastMsg.read ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Mobile Sidebar - Only show when conversation list is visible */}
                <div className={`block md:hidden ${showChat ? 'hidden' : 'block'}`}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default ConversationsList; 