import React from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";


function App() {
  const [user] = useAuthState(auth);
  const ENDPOINT = "https://fitbud-backend.herokuapp.com/";
  
  return (
    <Router>
      <Switch>
      <Route exact path="/">
          <LandingPage />
        </Route>
      {!user ? (
          <Switch>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/login">
              <LoginPage />
            </Route>
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/newuserform">
              <NewUserFormPage />
            </Route>
            <Switch>
              <Route exact path="/userdashboard">
                <UserDashboard />
              </Route>
            </Switch>
          </Switch>
        )}
      </Switch>
    </Router>
  );
}

export default App;
