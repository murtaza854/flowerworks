import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.scss';
import Routes from './Routes';
import { Admin } from './admin';
import { Thankyou } from './pages';
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
  return (
    <Router>
      <Switch>
        <Route path="/thankyou" children={<Thankyou />} />
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="*">
          <Routes />
        </Route>
      </Switch>
      {/* <div>
      {routes.map(({ path, id, Component }) => (
        <Route key={id} exact path={path}>
          {({ match }) => (
            <div>
            <CSSTransition
              key={id}
              in={match != null}
              timeout={300}
              classNames="page"
              unmountOnExit
            >
              <div className="page">
                <SmallBanner />
                <div className="global-mt-2"></div>
                <Navbar />
                <div className="global-mt-1"></div>
                <Component />
                <div className="global-mt-1"></div>
                <IconBanner />
                <Footer />
              </div>
            </CSSTransition>
            </div>
          )}
        </Route>
      ))}
    </div> */}
      {/* <div>
      <Switch>
        <Route path="/do-it-yourself">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <DIY />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route path="/cart">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <Cart />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route path="/subscribe">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <Subscribe />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route path="/signin">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <Signin />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route path="/signup">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <Signup />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route path="/:category">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <Shop />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route>
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-1"></div>
          <Home />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
      </Switch>
      </div> */}
    </Router>
  );
}

export default App;
