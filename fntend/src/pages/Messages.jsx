import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Messages = () => {
    const { user } = useContext(UserDataContext);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false); // For mobile view
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchFriends();
        const interval = setInterval(fetchMessages, 3000); // Poll for new messages
        return () => clearInterval(interval);
    }, [selectedFriend]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/friends`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setFriends(response.data.friends);
            }
        } catch (err) {
            console.error('Error fetching friends:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!selectedFriend) return;
        
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/messages/${selectedFriend._id}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setMessages(response.data.messages);
                scrollToBottom();
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend) return;

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/messages/send`,
                {
                    receiverId: selectedFriend._id,
                    text: newMessage
                },
                { withCredentials: true }
            );
            if (response.data.success) {
                setMessages([...messages, response.data.message]);
                setNewMessage('');
                scrollToBottom();
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const selectFriend = (friend) => {
        setSelectedFriend(friend);
        setShowChat(true); // Show chat on mobile when friend is selected
    };

    return (
        <>
            <div className='mb-18'>
                <Header />
            </div>
            {/* <div className='z-100'>
                <Sidebar />
            </div> */}
            <div className="bg-gray-50">
                <div className="flex flex-col md:flex-row h-screen">
                    {/* Left sidebar - Conversations list */}
                    <div className={`w-full md:w-[350px] bg-white border-r border-gray-200 h-[calc(100vh-4rem)] md:h-auto ${showChat ? 'hidden md:block' : 'block'}`}>
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold">Messages</h2>
                        </div>
                        <div className="overflow-y-auto h-full">
                            <div className="p-3">
                                <input
                                    type="text"
                                    placeholder="Search messages"
                                    className="w-full bg-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {friends.map(friend => (
                                <div
                                    key={friend._id}
                                    onClick={() => selectFriend(friend)}
                                    className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-l-4 ${selectedFriend?._id === friend._id ? 'border-blue-500 bg-gray-50' : 'border-transparent'}`}
                                >
                                    <div className="relative">
                                        <img 
                                            src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${friend.profilePhoto}`}
                                            className="rounded-full w-12 h-12 border border-gray-200"
                                            alt="Profile"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                            }}
                                        />
                                        {friend.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">{friend.username}</p>
                                            {friend.lastMessage?.createdAt && (
                                                <span className="text-xs text-gray-400">
                                                    {new Date(friend.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm truncate">
                                            {friend.lastMessage?.text || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Chat area */}
                    <div className={`flex-1 flex flex-col bg-white ${!showChat ? 'hidden md:flex' : 'flex'}`}>
                        {selectedFriend ? (
                            <>
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <button 
                                            className="md:hidden mr-2 text-blue-500"
                                            onClick={() => setShowChat(false)}
                                        >
                                            ←
                                        </button>
                                        <div className="relative">
                                            <img 
                                                src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${selectedFriend.profilePhoto}`}
                                                className="rounded-full w-10 h-10 border border-gray-200"
                                                alt="Profile"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                                }}
                                            />
                                            {selectedFriend.isOnline && (
                                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <span className="font-semibold">{selectedFriend.username}</span>
                                            <p className="text-xs text-gray-500">
                                                {selectedFriend.isOnline ? 'Active now' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                    <div className="flex flex-col gap-3">
                                        {messages.map(message => (
                                            <div 
                                                key={message._id}
                                                className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {message.sender !== user._id && (
                                                    <img 
                                                        src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${selectedFriend.profilePhoto}`}
                                                        className="rounded-full w-6 h-6 mt-1 mr-2"
                                                        alt="Profile"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                                        }}
                                                    />
                                                )}
                                                <div className={`${
                                                    message.sender === user._id 
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white border border-gray-100'
                                                } rounded-2xl py-2 px-4 max-w-[80%] md:max-w-md shadow-sm`}>
                                                    {message.text}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </div>
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Message..."
                                            className="flex-1 border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button 
                                            type="submit"
                                            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-3 rounded-full text-sm font-medium"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a conversation to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <Footer/> */}
        </>
    );
};

export default Messages;