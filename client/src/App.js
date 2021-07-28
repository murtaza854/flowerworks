import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.scss';
import Routes from './Routes';
import { Admin } from './admin';
import { Thankyou } from './pages';
import api from "./api";
import React, { useState, useEffect } from 'react';
import UserContext from "./authenticatedUser";
// import './Form.scss';
// import './global.scss';

// const routes = [
//   { id: 1, path: '/', name: 'Home', Component: Home },
//   { id: 2, path: '/:category', name: 'Shop', Component: Shop },
//   { id: 3, path: '/subscribe', name: 'Subscribe', Component: Subscribe },
//   // { path: '/do-it-yourself', name: 'DiY', Component: DIY },
//   // { path: '/signin', name: 'Signin', Component: Signin },
//   // { path: '/signup', name: 'Signup', Component: Signup },
//   // { path: '/cart', name: 'Cart', Component: Cart },
// ]

function App() {
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${api}/users/loggedIn`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        try {
          const user = content.data;
          setUserState(user);
        } catch (error) {
          setUserState(null);
        }
        setLoading(false)
      })();
  }, []);

  if (loading) return <div></div>

  return (
    <UserContext.Provider value={{ userState: userState, setUserState: setUserState }}>
      <Router>
        <Switch>
          <Route path="/thankyou" children={<Thankyou />} />
          <Route path="/admin">
            <Admin loading={loading} />
          </Route>
          <Route path="*">
            <Routes />
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
