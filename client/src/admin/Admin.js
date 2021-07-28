import React, { useState, useContext } from 'react';
import { Login, AdminLayout } from '../admin';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import UserContext from '../authenticatedUser';

function Admin(props) {
  const [darkState, setDarkState] = useState(false);
  const user = useContext(UserContext);
  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: {
        main: '#757575',
      },
      secondary: {
        main: '#000000',
      },
      error: {
        main: '#c31200',
      },
      typography: {
        fontFamily: 'Raleway',
      },
    },
  });
  const lightTheme = createTheme({
    palette: {
      type: "light",
      primary: {
        main: '#000000',
      },
      secondary: {
        main: '#757575',
      },
      error: {
        main: '#c31200',
      },
      typography: {
        fontFamily: 'Raleway',
      },
    },
  });
  const currentTheme = darkState ? darkTheme : lightTheme;

  if (props.loading) return <div></div>

  return (
    <ThemeProvider theme={currentTheme}>
      {!user.userState ? (
        <Login user={user} title="Flowerworks: Admin Login" />
      ) : (
        <AdminLayout user={user} darkState={darkState} setDarkState={setDarkState} title="Flowerworks: Dashboard" />
      )}
    </ThemeProvider>
  );
}

export default Admin;