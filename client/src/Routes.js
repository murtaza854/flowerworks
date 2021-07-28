import React, { useState, useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation
} from "react-router-dom";
import { SmallBanner, Navbar, IconBanner, Footer, ConfirmationMessage } from './components';
import { Home, Shop, Signup, Signin, Subscribe, Cart, DIY, Product, ForgotPassword } from './pages';
import { Dashboard } from './dashboard';
import CartContext from './share';
import DiscountContext from './discountContext';
import api from './api';
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group";
//   import './App.scss';
import './Form.scss';
import './global.scss';
import Auth from './auth/Auth';

function Routes(props) {
  const [cart, setCart] = useState({ data: {}, count: 0 });
  const [discountState, setDiscountState] = useState(null);
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
        const response = await fetch(`${api}/discounts/get-discount`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          withCredentials: true,
        });
        const content = await response.json();
        setDiscountState(content.data);
      })();
  }, []);

  // useEffect(() => {
  //   (
  //     async () => {
  //       const response = await fetch(`${api}/users/loggedIn`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         credentials: 'include',
  //         withCredentials: true,
  //       });
  //       const content = await response.json();
  //       try {
  //         const user = content.data;
  //         setUserState({ firstName: user.firstName, lastName: user.lastName, contactNumber: user.contactNumber, email: user.email, emailVerified: user.emailVerified });
  //       } catch (error) {
  //         setUserState();
  //       }
  //     })();
  // }, []);

  return (
    <CartContext.Provider value={{ cartObj: cart, setCart: setCart }}>
      <DiscountContext.Provider value={discountState}>
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
                <Route path="/__/auth/action">
                  <Auth />
                </Route>
                <Route path="/forgot-password/sent" children={
                  <ConfirmationMessage
                    first=""
                    bold="Password Reset"
                    second=""
                  />
                } />
                <Route path="/logout" children={
                  <ConfirmationMessage
                    first=""
                    bold="Account Authentication"
                    second=""
                  />
                } />
                <Route path="/account-creation" children={
                  <ConfirmationMessage
                    first=""
                    bold="Account creation"
                    second=""
                  />
                } />
                <Route path="/email-verification" children={
                  <ConfirmationMessage
                    first=""
                    bold="Email verification"
                    second=""
                  />
                } />
                <Route path="/dashboard" children={<Dashboard />} />
                <Route path="/signup" children={<Signup />} />
                <Route path="/signin" children={<Signin />} />
                <Route path="/forgot-password" children={<ForgotPassword />} />
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
      </DiscountContext.Provider>
    </CartContext.Provider>
  );
}

export default Routes;