import "./style.scss";
import logo from "../../assets/topLogo.png";
import { NavLink } from "react-router-dom";

const VideoNavBar = (props) => {
  return (
    <nav className="videoNavBar">
      <NavLink to="/userdashboard">
        <img src={logo} alt="Fitbud" className="logo" />
      </NavLink>
      <span className="exercisePartner">Exercising with Om Joshi</span>
      <div className="videoNavBarRight">
        <span className="exerciseTimer">
          {Math.floor(props.currentTime / 60)}m {props.currentTime % 60}s
        </span>
        <NavLink to="/profile">
          <button className="endSessionButton">End Session</button>
        </NavLink>
      </div>
    </nav>
  );
};

export default VideoNavBar;
