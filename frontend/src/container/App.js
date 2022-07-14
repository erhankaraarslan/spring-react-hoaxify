import React from "react";
import UserSignupPage from "../pages/userSignupPage";
import LoginPage from "../pages/LoginPage";
import LanguageSelector from "../components/LanguageSelector";
import HomePage from "../pages/HomePage";
import UserPage from "../pages/UserPage";
import { useSelector } from "react-redux/es/exports";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import TopBar from "../components/TopBar";

const App = (props) => {
  const { isLoggedIn } = useSelector((store) => ({
    isLoggedIn: store.isLoggedIn,
  }));

  return (
    <div>
      <Router>
        <TopBar />
        <Switch>
          <Route exact path='/' component={HomePage} />
          {!isLoggedIn && <Route path='/login' component={LoginPage} />}
          {!isLoggedIn && <Route path='/signup' component={UserSignupPage} />}
          <Route path='/user/:username' component={UserPage} />
          <Redirect to='/' />
        </Switch>
      </Router>

      <LanguageSelector />
    </div>
  );
};

//const TopBarWithTranslation = withTranslation()(TopBar);

// const mapStateToProps = (store) => {
//   return {
//     isLoggedIn: store.isLoggedIn,
//   };
// };

// export default connect(mapStateToProps, null)(App);
export default App;
