import React, { useEffect, useState } from 'react';
import { Login, AdminLayout } from '../admin';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import api from '../api';

function Admin(props) {
    const [token, setToken] = useState("loading");
    const [darkState, setDarkState] = useState(false);
    const darkTheme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
              main: '#000000',
            },
            secondary: {
              main: '#f9f9f9',
            },
            error: {
              main: '#ff1500',
            },
            typography: {
            fontFamily: 'Raleway',
            },
          },
    });
    const lightTheme = createMuiTheme({
        palette: {
            type: "light",
            primary: {
              main: '#f9f9f9',
            },
            secondary: {
              main: '#000000',
            },
            error: {
              main: '#ff1500',
            },
            typography: {
            fontFamily: 'Raleway',
            },
          },
    });
    const currentTheme = darkState ? darkTheme : lightTheme;

    useEffect(() => {(
        async () => {
            if (token !== true) {
                const response = await fetch(`${api}/users/loggedIn`, {
                  headers: {'Content-Type': 'application/json'},
                  credentials: 'include',
                  withCredentials: true,
                });
                const content = await response.json();
                setToken(content.loggedIn);
            }
          // setDarkState(content.darkState);
          // const response1 = await fetch('http://localhost:4000/api/get-darktheme', {
          //   method: 'GET',
          //   headers: {'Content-Type': 'application/json'},
          //   credentials: 'include',
          //   withCredentials: true,
          // });
          // const content1 = await response1.json();
          // console.log(Boolean(content1.darktheme))
          // setDarkState(Boolean(content1.darktheme));
        })();
    });

    const pathArray = window.location.pathname.split('/');

    if (token === 'loading') return <div></div>;
    if (pathArray.length >= 2 && pathArray[1] === 'admin' && !token) {
        return (<Login setToken={setToken} title="Flowerworks: Admin Login" /> );
    }

    return (
        <ThemeProvider theme={currentTheme}>
              {!token ? (
                <Login setToken={setToken} title="Flowerworks: Admin Login" />
                ) : (
                <AdminLayout darkState={darkState} setDarkState={setDarkState} setToken={setToken} title="Flowerworks: Dashboard" />
               )}
        </ThemeProvider>
    );
}

export default Admin;