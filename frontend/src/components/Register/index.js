import "./style.scss";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import { auth } from "../../firebase";

const Register = () => {
  const history = useHistory();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const [fullName, setFullName] = useState(null);

  const register = (e) => {
    e.preventDefault();
    if (confirmPasswordRef.current.value === passwordRef.current.value) {
      auth
        .createUserWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        )
        .then(() =>
          auth.currentUser
            .updateProfile({
              displayName: fullName,
            })
            .then(() => history.push("/newuserform"))
            .catch((error) => console.log(error))
        )
        .catch((e) => alert(e.message));
    } else {
      alert("Passwords don't match!");
    }
  };

  return (
    <div className="Register">
      <div className="registerGlassContainer">
        <h2>Register</h2>
        <input
          className="registerInput"
          type="text"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="registerInput"
          type="email"
          placeholder="Email"
          ref={emailRef}
        />
        <input
          className="registerInput"
          type="password"
          placeholder="Password"
          ref={passwordRef}
        />
        <input
          className="registerInput"
          type="password"
          placeholder="Confirm Password"
          ref={confirmPasswordRef}
        />
        <button className="registerButton" onClick={register}>
          <p>Register</p>
        </button>
        <p className="registerQuestion">
          Already have an account?{" "}
          <span
            className="registerRedirect"
            onClick={() => history.push("/login")}
          >
            Login!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
