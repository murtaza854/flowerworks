import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { Home, Shop } from './pages'
import { SmallBanner, Navbar, IconBanner, Footer } from './components'

function App() {
  return (
    <Router>
      <div>
      <Switch>
        <Route path="/:category">
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-2"></div>
          <Shop />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
        <Route>
          <SmallBanner />
          <div className="global-mt-2"></div>
          <Navbar />
          <div className="global-mt-2"></div>
          <Home />
          <div className="global-mt-1"></div>
          <IconBanner />
          <Footer />
        </Route>
      </Switch>
      </div>
    </Router>
  );
}

export default App;
