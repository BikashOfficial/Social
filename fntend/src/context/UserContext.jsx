import { createContext, useState, useEffect } from 'react';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : {
            name: '',
            email: '',
        };
    });

    // Update localStorage whenever user changes
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const logout = () => {
        setUser({ name: '', email: '' });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <UserDataContext.Provider value={{ user, setUser,logout }}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserContext;

// import { createContext, useState } from 'react';

// export const UserDataContext = createContext();

// const UserContext = ({ children }) => {
//     const [user, setUser] = useState({
//         name: '',
//         email: '',
//     });

//     return (
//         <UserDataContext.Provider value={{ user, setUser }}>
//             {children}
//         </UserDataContext.Provider>
//     );
// }

// export default UserContext;