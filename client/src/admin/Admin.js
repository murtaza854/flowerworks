import React, { useContext, useEffect, useState } from 'react';
import { Login, AdminLayout } from '../admin';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './Admin.scss';
import UserContext from '../contexts/userContext';
import api from '../api';


function Admin(props) {
    const [userState, setUserState] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = useContext(UserContext);

    const lightTheme = createTheme({
        palette: {
            type: 'light',
            primary: {
                main: '#000000',
            },
            secondary: {
                main: '#f9f9f9',
            },
        },
        typography: {
            fontFamily: 'Raleway',
        },
    });



    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${api}/user/logged-in-admin`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        withCredentials: true,
                    });
                    const content = await response.json();
                    const user = content.data;
                    const { displayName, email, emailVerified, admin } = user;
                    setUserState({ displayName, email, emailVerified, admin });
                    setLoading(false);
                } catch (error) {
                    setUserState(null);
                    setLoading(false);
                }
            })();
    }, []);

    if (loading) return <div></div>;

    return (
        <UserContext.Provider value={{ userState: userState, setUserState: setUserState }}>
            <ThemeProvider theme={lightTheme}>
                {/* <Login setToken={setToken} title="Mzushi: Admin Login" /> */}
                {!userState ? (
                    <Login title="Floweworks: Admin Login" />
                ) : (
                    <AdminLayout user={user} />
                )}
            </ThemeProvider>
        </UserContext.Provider >
    );
}

export default Admin;