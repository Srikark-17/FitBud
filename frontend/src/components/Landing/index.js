import { Link } from "react-router-dom";

import rect from "../../assets/rectangecol.svg";
import logo from "../../assets/logo.png";

import "./style.scss";

const Landing = () => {
  return (
    <div className="Landing">
      <div className="info">
        <h1 className="projectName">FitBud</h1>
        <div className="description">
          <p>Workout with a buddy!</p>
          <p>Powered by machine learning</p>
          <p>Get AI assisted support</p>
        </div>
        <Link to="/register">
          <button className="joinButton">Join Now</button>
        </Link>
      </div>
      <img src={rect} alt="rectangle" className="slantedRectangle" />
      <img src={logo} alt="FitBud Logo" className="logo" />
    </div>
  );
};

export default Landing;
