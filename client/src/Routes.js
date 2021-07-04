import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import { SmallBanner, Navbar, IconBanner, Footer } from './components';
import { Home, Shop, Signup, Signin, Subscribe, Cart, DIY, Product } from './pages';
import CartContext from './share';
import UserContext from './authenticatedUser';
import api from './api';

import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
//   import './App.scss';
import './Form.scss';
import './global.scss';

function Routes(props) {
  const [cart, setCart] = useState({ data: {}, count: 0 });
  const [userState, setUserState] = useState();
  let location = useLocation();

  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${api}/cart/getCart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        setCart(content.data);
      })();
  }, []);

  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${api}/users/loggedIn`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        try {
          const user = content.data;
          setUserState({ firstName: user.firstName, lastName: user.lastName, contactNumber: user.contactNumber, email: user.email, emailVerified: user.emailVerified });
        } catch (error) {
          setUserState();
        }
      })();
  }, []);

  return (
    <CartContext.Provider value={{ cartObj: cart, setCart: setCart }}>
      <UserContext.Provider value={userState}>
        <SmallBanner />
        <div className="global-mt-2"></div>
        <Navbar />
        <div className="global-mt-1"></div>
        <TransitionGroup>
          <CSSTransition
            key={location.key}
            classNames="page"
            timeout={300}
          >
            <div className="page">
              <Switch location={location}>
                <Route path="/signup" children={<Signup />} />
                <Route path="/signin" children={<Signin />} />
                <Route path="/cart" children={<Cart />} />
                <Route path="/do-it-yourself" children={<DIY />} />
                <Route path="/subscribe" children={<Subscribe />} />
                <Route path="/:category/:product" children={<Product />} />
                <Route path="/:category" children={<Shop />} />
                <Route path="/" children={<Home />} />
              </Switch>
              <div className="global-mt-1"></div>
              <IconBanner />
              <Footer />
            </div>
          </CSSTransition>
        </TransitionGroup>
      </UserContext.Provider>
    </CartContext.Provider>
  );
}

export default Routes;