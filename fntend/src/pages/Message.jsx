import React from 'react'

const Message = () => {
  return (
    <div>
        <div className="flex-1 flex flex-col bg-white">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <img src="https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000" className="rounded-full w-10 h-10 border border-gray-200" alt="Profile" />
                        <div className="ml-3">
                            <span className="font-semibold">John Doe</span>
                            <p className="text-xs text-gray-500">Active now</p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {/* Messages */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-end">
                            <div className="bg-blue-500 text-white rounded-2xl py-2 px-4 max-w-[80%] md:max-w-md shadow-sm">
                                Hey, how are you?
                            </div>
                        </div>
                        <div className="flex justify-start"></div>
                            <img src="https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000" className="rounded-full w-6 h-6 mt-1 mr-2" alt="Profile" />
                            <div className="bg-white rounded-2xl py-2 px-4 max-w-[80%] md:max-w-md shadow-sm border border-gray-100">
                                I'm good, thanks! How about you?
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Message..." 
                            className="flex-1 border border-gray-200 rounded-full px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-3 rounded-full text-sm font-medium">
                            Send
                        </button>
                    </div>
                </div>
            </div>
    
  )
}

export default Message