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
        if (user && user.email) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);
    
    // Set default auth header when token changes and check token validity
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            logAuth('User context initialized with token');
            
            // Skip checking token if we've already verified it recently
            const lastVerified = sessionStorage.getItem('auth_verified_at');
            const currentTime = new Date().getTime();
            const verificationWindow = 30 * 60 * 1000; // 30 minutes in milliseconds
            
            if (lastVerified && (currentTime - parseInt(lastVerified)) < verificationWindow) {
                logAuth('Token already verified recently, skipping check');
                return;
            }
            
            // Check token validity here
            const checkTokenValidity = async () => {
                try {
                    await api.get('/user/profile');
                    logAuth('Token validated');
                    // Mark as verified
                    sessionStorage.setItem('auth_verified_at', currentTime.toString());
                } catch (error) {
                    logAuth('Token validation failed', { error: error.response?.data });
                    // Don't logout automatically, let the ProtectedRoute handle that
                    if (error.response && error.response.status === 401) {
                        logAuth('Invalid token detected, will need reverification');
                        sessionStorage.removeItem('auth_verified_at');
                    }
                }
            };
            
            checkTokenValidity();
        } else {
            logAuth('No token found on initialization');
            sessionStorage.removeItem('auth_verified_at');
            setIsAuthenticated(false);
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
        sessionStorage.removeItem('auth_verified_at');
        
        // Log the auth state after logout
        setTimeout(() => {
            dumpAuthDebugInfo();
        }, 100);
    };
    
    const login = (userData, token) => {
        logAuth('Logging in user', { userData, token: token ? `${token.substring(0, 15)}...` : null });
        
        if (!userData || !token) {
            logAuth('Login failed - missing user data or token');
            return false;
        }
        
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store data in both localStorage (persistent) and sessionStorage (current session)
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        sessionStorage.setItem('auth_verified_at', new Date().getTime().toString());
        
        // Log the auth state after login
        setTimeout(() => {
            dumpAuthDebugInfo();
        }, 100);
        
        return true;
    };

    // Helper method to update the verification status
    const refreshVerificationStatus = () => {
        sessionStorage.setItem('auth_verified_at', new Date().getTime().toString());
        logAuth('Manually refreshed verification status');
    };

    return (
        <UserDataContext.Provider value={{ 
            user, 
            setUser, 
            logout, 
            login, 
            isAuthenticated,
            refreshVerificationStatus
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