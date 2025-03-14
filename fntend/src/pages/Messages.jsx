import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { formatDistanceToNow } from 'date-fns';
import { socketService } from '../services/socketService';
import ChatArea from '../components/ChatArea';
import ConversationsList from '../components/chat/ConversationsList';
import { ensureProfilePhotos } from '../utils/profileUtils';

const Messages = () => {
    const { user } = useContext(UserDataContext);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [lastSeen, setLastSeen] = useState({});
    const [unreadMessages, setUnreadMessages] = useState({});
    const [lastMessages, setLastMessages] = useState({});
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        if (user?._id) {
            socketService.connect(user._id);
            setupSocketListeners();

            // Cleanup on unmount
            return () => {
                socketService.removeAllListeners();
                socketService.disconnect();
            };
        }
    }, [user]);

    const setupSocketListeners = () => {
        // Initial online users
        socketService.onInitialOnlineUsers((onlineUserIds) => {
            setOnlineUsers(new Set(onlineUserIds.map(id => String(id))));
        });

        // Message events
        socketService.onMessage((message) => {
            console.log('Raw received message:', message);
            
            // Normalize the received message
            const normalizedMessage = {
                ...message,
                sender: String(typeof message.sender === 'object' ? message.sender._id || message.sender.id : message.sender),
                receiver: String(typeof message.receiver === 'object' ? message.receiver._id || message.receiver.id : message.receiver)
            };
            
            console.log('Normalized received message:', normalizedMessage);
            
            setMessages(prev => {
                // Check if message already exists to prevent duplicates
                if (prev.some(m => m._id === normalizedMessage._id)) {
                    return prev;
                }
                return [...prev, normalizedMessage];
            });
            
            // Update last messages
            const messagePartnerId = normalizedMessage.sender === String(user._id) 
                ? normalizedMessage.receiver 
                : normalizedMessage.sender;
            
            setLastMessages(prev => ({
                ...prev,
                [messagePartnerId]: normalizedMessage
            }));
            
            const selectedFriendId = selectedFriend ? String(selectedFriend._id) : null;
            
            if (selectedFriendId === normalizedMessage.sender) {
                // Mark message as read since chat is open
                socketService.markMessageRead(normalizedMessage._id, normalizedMessage.sender);
            } else {
                // Increment unread count for this sender
                setUnreadMessages(prev => ({
                    ...prev,
                    [normalizedMessage.sender]: (prev[normalizedMessage.sender] || 0) + 1
                }));
            }
        });

        // Message sent confirmation
        socketService.onMessageSent((message) => {
            console.log('Raw sent message confirmation:', message);
            
            const userId = String(user._id);
            
            // Normalize the sent message
            const normalizedMessage = {
                ...message,
                sender: userId, // Always use the current user's ID for sent messages
                receiver: String(typeof message.receiver === 'object' ? message.receiver._id || message.receiver.id : message.receiver)
            };
            
            console.log('Normalized sent message:', normalizedMessage);
            
            setMessages(prev => {
                // Check if message already exists
                if (prev.some(m => m._id === normalizedMessage._id)) {
                    return prev;
                }
                return [...prev, normalizedMessage];
            });
            
            // Update last messages
            setLastMessages(prev => ({
                ...prev,
                [normalizedMessage.receiver]: normalizedMessage
            }));
        });

        // Typing events
        socketService.onTyping(({ userId, isTyping }) => {
            if (selectedFriend?._id === userId) {
                setIsTyping(isTyping);
                // Clear typing indicator after 3 seconds
                if (isTyping) {
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }
                    typingTimeoutRef.current = setTimeout(() => {
                        setIsTyping(false);
                    }, 3000);
                }
            }
        });

        // User status events
        socketService.onUserStatus(({ userId, status, lastSeen: lastSeenTime }) => {
            if (status === 'online') {
                setOnlineUsers(prev => new Set([...prev, userId]));
            } else {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
                if (lastSeenTime) {
                    setLastSeen(prev => ({
                        ...prev,
                        [userId]: new Date(lastSeenTime)
                    }));
                }
            }
        });

        // Message read status events
        socketService.onMessageRead(({ messageId }) => {
            setMessages(prev => prev.map(msg => 
                msg._id === messageId ? { ...msg, read: true } : msg
            ));
        });

        // Friend request events
        socketService.onFriendRequest((data) => {
            // Refresh friends list when receiving a new friend request
            fetchFriends();
        });
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        if (selectedFriend) {
            fetchMessages();
            setError(null);
            // Clear unread messages for selected friend
            setUnreadMessages(prev => ({
                ...prev,
                [selectedFriend._id]: 0
            }));
        }
    }, [selectedFriend]);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/friends`,
                { withCredentials: true }
            );
            if (response.data.success) {
                console.log('Fetched friends:', response.data.friends);
                // Use the utility function to ensure each friend has a profilePhoto property
                const friendsWithPhotos = ensureProfilePhotos(response.data.friends);
                setFriends(friendsWithPhotos);
            }
        } catch (err) {
            console.error('Error fetching friends:', err);
            setError('Failed to load friends. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async () => {
        if (!selectedFriend) return;
        
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/messages/${selectedFriend._id}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                console.log('Raw fetched messages:', response.data.messages);
                console.log('Current user ID:', user._id);
                
                // Normalize message IDs to strings for consistency
                const normalizedMessages = response.data.messages.map(msg => {
                    // Ensure sender is stored as a string ID
                    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                    return {
                        ...msg,
                        sender: String(senderId)
                    };
                });
                
                console.log('Normalized messages:', normalizedMessages);
                setMessages(normalizedMessages);
                scrollToBottom();
                
                // Mark all messages as read
                normalizedMessages.forEach(msg => {
                    if (!msg.read && msg.sender === String(selectedFriend._id)) {
                        socketService.markMessageRead(msg._id);
                    }
                });
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load messages. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend || sendingMessage) return;

        try {
            setSendingMessage(true);
            setError(null);
            
            const userId = String(user._id);
            const friendId = String(selectedFriend._id);
            
            // Create temporary message for immediate display
            const tempMessage = {
                _id: Date.now().toString(), // temporary ID
                sender: userId,
                receiver: friendId,
                text: newMessage,
                read: false,
                createdAt: new Date().toISOString()
            };

            console.log('Sending message with sender ID:', userId);
            console.log('Temp message:', tempMessage);

            // Add message to UI immediately
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/messages/send`,
                {
                    receiverId: friendId,
                    text: newMessage
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                const newMsg = response.data.message;
                console.log('Server response message:', newMsg);
                
                // Normalize the new message before updating
                const normalizedMsg = {
                    ...newMsg,
                    sender: userId, // Use the same userId to ensure consistency
                    receiver: friendId
                };
                
                console.log('Normalized message:', normalizedMsg);
                
                // Update the temporary message with the normalized one
                setMessages(prev => prev.map(msg => 
                    msg._id === tempMessage._id ? normalizedMsg : msg
                ));
                
                // Update last messages
                setLastMessages(prev => ({
                    ...prev,
                    [friendId]: normalizedMsg
                }));
                
                // Emit new message via socket with normalized sender
                socketService.sendMessage({
                    ...normalizedMsg,
                    receiverId: friendId
                });
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to send message. Please try again.');
            // Remove the temporary message if sending failed
            setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id));
        } finally {
            setSendingMessage(false);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        
        // Emit typing status via socket
        if (selectedFriend) {
            socketService.sendTyping({
                userId: user._id,
                receiverId: selectedFriend._id,
                isTyping: true
            });

            // Clear previous timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set new timeout to stop typing indicator
            typingTimeoutRef.current = setTimeout(() => {
                socketService.sendTyping({
                    userId: user._id,
                    receiverId: selectedFriend._id,
                    isTyping: false
                });
            }, 2000);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const selectFriend = (friend) => {
        setSelectedFriend(friend);
        setShowChat(true);
        setIsTyping(false);
        setError(null); // Clear any previous errors
    };

    const formatLastSeen = (userId) => {
        const lastSeenDate = lastSeen[userId];
        if (!lastSeenDate) return 'Offline';
        return `Last seen ${formatDistanceToNow(lastSeenDate, { addSuffix: true })}`;
    };

    if (loading && !selectedFriend) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <div className="flex flex-col min-h-screen mt-16">
            <div className="flex-none">
                <Header />
            </div>
            
            <div className="flex-1 bg-gray-50">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4">
                        <span className="block sm:inline">{error}</span>
                        <button 
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setError(null)}
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                    </div>
                )}
                {/* <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-9rem)]"> */}
                <div className="">
                    {/* Left sidebar - Conversations list */}
                    <ConversationsList 
                        friends={friends}
                        selectedFriend={selectedFriend}
                        selectFriend={selectFriend}
                        lastMessages={lastMessages}
                        unreadMessages={unreadMessages}
                        onlineUsers={onlineUsers}
                        user={user}
                        showChat={showChat}
                    />

                    {/* Right side - Chat area */}
                    <div className={`flex-1 ${!showChat ? 'hidden md:block' : 'block'}`}>
                        <ChatArea 
                            selectedFriend={selectedFriend}
                            user={user}
                            messages={messages}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            sendingMessage={sendingMessage}
                            handleSendMessage={handleSendMessage}
                            handleTyping={handleTyping}
                            isTyping={isTyping}
                            onlineUsers={onlineUsers}
                            lastSeen={lastSeen}
                            setShowChat={setShowChat}
                        />
                    </div>
                </div>
            </div>
            
            
        </div>
    );
};

export default Messages;