import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

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
    
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

    // Update localStorage whenever user changes
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);
    
    // Set default auth header when token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            console.log('Setting default auth header with token');
        }
    }, [isAuthenticated]);

    const logout = () => {
        setUser({ name: '', email: '' });
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Optional: call logout API
        api.get('/user/logout').catch(err => console.error('Logout error:', err));
    };
    
    const login = (userData, token) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    return (
        <UserDataContext.Provider value={{ 
            user, 
            setUser, 
            logout, 
            login, 
            isAuthenticated 
        }}>
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