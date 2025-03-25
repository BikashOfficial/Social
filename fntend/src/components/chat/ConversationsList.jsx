import React from 'react';
import Sidebar from '../Sidebar';
import { getProfilePhotoUrl, handleImageError } from '../../utils/imageUtils';

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
                    {friends && friends.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {friends.map(friend => {
                                const lastMessage = lastMessages[friend._id];
                                const unreadCount = unreadMessages[friend._id] || 0;
                                
                                return (
                                    <div 
                                        key={friend._id} 
                                        className={`p-3 flex items-center cursor-pointer transition-colors hover:bg-gray-50 ${
                                            selectedFriend?._id === friend._id ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => selectFriend(friend)}
                                    >
                                        <div className="relative">
                                            <img 
                                                src={getProfilePhotoUrl(friend)}
                                                className="rounded-full w-12 h-12 border border-gray-200"
                                                alt={friend.username || "Friend"}
                                                onError={handleImageError}
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
                                        <div className="ml-3 flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-semibold truncate">{friend.name}</h3>
                                                {lastMessage && (
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-xs truncate ${unreadCount > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                                {lastMessage ? lastMessage.text : 'No messages yet'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            <p>No conversations yet</p>
                            <p className="text-sm mt-1">Find friends to start chatting</p>
                        </div>
                    )}
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