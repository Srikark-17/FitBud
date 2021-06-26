import React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";


function App() {
  const ENDPOINT = "https://fitbud-backend.herokuapp.com/";
  
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
