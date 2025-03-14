import React from 'react';

const ChatInput = ({ newMessage, handleTyping, handleSendMessage, sendingMessage }) => {
    return (
        <div className="flex-none">
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Message..."
                        className="flex-1 border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit"
                        className={`${
                            sendingMessage 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600'
                        } transition-colors text-white px-6 py-3 rounded-full text-sm font-medium`}
                        disabled={sendingMessage}
                    >
                        {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInput; 