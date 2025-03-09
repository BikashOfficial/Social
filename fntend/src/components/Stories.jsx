import React from 'react'

const Stories = () => {
    const stories = [
        { id: 1, username: 'user1', avatar: 'https://placekitten.com/100/100' },
        { id: 2, username: 'user2', avatar: 'https://placekitten.com/101/101' },
        { id: 3, username: 'user3', avatar: 'https://placekitten.com/102/102' },
        { id: 4, username: 'user4', avatar: 'https://placekitten.com/103/103' },
        { id: 5, username: 'user5', avatar: 'https://placekitten.com/104/104' },
        { id: 6, username: 'user6', avatar: 'https://placekitten.com/105/105' },
        { id: 7, username: 'user7', avatar: 'https://placekitten.com/106/106' },
        { id: 8, username: 'user8', avatar: 'https://placekitten.com/107/107' },
        { id: 9, username: 'user9', avatar: 'https://placekitten.com/108/108' },
        { id: 10, username: 'user10', avatar: 'https://placekitten.com/109/109' },
        { id: 1, username: 'user1', avatar: 'https://placekitten.com/100/100' },
        { id: 2, username: 'user2', avatar: 'https://placekitten.com/101/101' },
        { id: 3, username: 'user3', avatar: 'https://placekitten.com/102/102' },
        { id: 4, username: 'user4', avatar: 'https://placekitten.com/103/103' },
        { id: 5, username: 'user5', avatar: 'https://placekitten.com/104/104' },
        { id: 6, username: 'user6', avatar: 'https://placekitten.com/105/105' },
        { id: 7, username: 'user7', avatar: 'https://placekitten.com/106/106' },
        { id: 8, username: 'user8', avatar: 'https://placekitten.com/107/107' },
        { id: 9, username: 'user9', avatar: 'https://placekitten.com/108/108' },
        { id: 10, username: 'user10', avatar: 'https://placekitten.com/109/109' },
        // add more story objects as needed to test scrolling
    ];

    return (
        <div className="overflow-x-auto">
            <div className="inline-flex p-4 space-x-4 min-w-full">
                {stories.map((story, index) => (
                    <div key={index} className="flex flex-col items-center flex-shrink-0">
                        <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-r from-pink-500 to-purple-500">
                            <img 
                                src={story.avatar} 
                                alt={story.username}
                                className="w-full h-full rounded-full border-2 border-white"
                            />
                        </div>
                        <span className="text-xs mt-1">{story.username}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Stories