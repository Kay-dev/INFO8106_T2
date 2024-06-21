import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem('loggedUser'));
        if (user) {
            setUser(user);
            setToken(user.token);
        }
    },[])

    const userLogin = (user) => {
        window.localStorage.setItem('loggedUser', JSON.stringify(user))

        setUser(user)
        setToken(user.token)
    }

    const userLogout = () => {
        window.localStorage.removeItem('loggedUser')    
        setUser(null)
        setToken(null)
    }


    return (
        <UserContext.Provider value={{ user, token, userLogin, userLogout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)