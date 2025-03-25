import { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { logAuth, dumpAuthDebugInfo } from '../utils/debug';

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
    
    // Set default auth header when token changes and check token validity
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            logAuth('User context initialized with token');
            
            // Optionally check token validity here
            const checkTokenValidity = async () => {
                try {
                    await api.get('/user/profile');
                    logAuth('Token validated');
                } catch (error) {
                    logAuth('Token validation failed', { error: error.response?.data });
                    // Don't logout automatically, let the ProtectedRoute handle that
                }
            };
            
            checkTokenValidity();
        } else {
            logAuth('No token found on initialization');
        }
    }, []);

    const logout = async () => {
        logAuth('Logging out user', { userId: user._id });
        
        // Attempt to call logout API, but don't wait for it
        try {
            await api.get('/user/logout');
            logAuth('Logout API call successful');
        } catch (err) {
            logAuth('Logout API call failed', err);
            // Continue with local logout even if API call fails
        }
        
        // Clear local state and storage
        setUser({ name: '', email: '' });
        setIsAuthenticated(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        
        // Log the auth state after logout
        setTimeout(() => {
            dumpAuthDebugInfo();
        }, 100);
    };
    
    const login = (userData, token) => {
        logAuth('Logging in user', { userData, token: token ? `${token.substring(0, 15)}...` : null });
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        
        // Log the auth state after login
        setTimeout(() => {
            dumpAuthDebugInfo();
        }, 100);
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