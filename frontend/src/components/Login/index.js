import { auth } from "../../firebase";
import { useRef } from "react";
import { useHistory } from "react-router";
import "./style.scss";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const history = useHistory();

  const login = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      )
      .then(() => history.push("/profile"))
      .catch((e) => alert(e.message));
  };

  return (
    <div className="Login">
      <div className="loginGlassContainer">
        <h2>Login</h2>
        <input
          className="loginInput"
          ref={emailRef}
          type="email"
          placeholder="Email"
        />
        <input
          className="loginInput"
          type="password"
          placeholder="Password"
          ref={passwordRef}
        />
        <button className="loginButton" onClick={login}>
          <p>Login</p>
        </button>
        <p className="loginQuestion">
          Don't have an account?{" "}
          <span
            className="loginRedirect"
            onClick={() => history.push("/register")}
          >
            Register!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
