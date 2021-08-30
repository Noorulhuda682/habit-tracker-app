import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import "./styles/login.scss";

import {
    Login,
    Dashboard,
    SignUp
} from "./screens/index"


const Routes =  () =>  {
  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <SignUp/>
          </Route>
          <Route path="/">
            <Dashboard/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Routes;