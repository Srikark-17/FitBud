import "./style.scss";
import { auth, db } from "../../firebase";
import Select from "react-select";
import { useRef, useState } from "react";
import { useHistory } from "react-router";

const NewUserForm = () => {
  const user = auth.currentUser;
  const equipmentRef = useRef(null);
  const hourRef = useRef(null);
  const muscleRef = useRef(null);
  const heightRef = useRef(null);
  const weightRef = useRef(null);
  const genderRef = useRef(null);
  const history = useHistory();
  const [selectedOption, setSelectedOption] = useState([]);
  const workoutTypes = [
    { label: "Jumping Jacks" },
    { label: "Squats" },
    { label: "Bicep curls" },
    {
      label: "Yoga/Stretching ",
    },
  ];

  const handleSubmit = () => {
    db.collection("users").doc(user.uid).set(
      {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        typeOfWorkout: selectedOption,
        equipment: equipmentRef.current.value,
        exerciseDuration: hourRef.current.value,
        muscleGroups: muscleRef.current.value,
        height: heightRef.current.value,
        weight: weightRef.current.value,
        gender: genderRef.current.value,
      },
      { merge: true }
    );
    history.push("/profile");
  };

  const handleChange = (selectedOptions) => {
    setSelectedOption(selectedOptions);
  };

  return (
    <div className="userForm">
      <div className="userFormContainer">
        <div>
          <h1>Fitbud</h1>
          <h4>Answer these questions to better match your experience</h4>
        </div>
        <form>
          <div>
            <div className="userFormContainerQuestion">
              <p>What type of workout do you want to do?</p>
              <Select
                isMulti
                value={selectedOption}
                onChange={handleChange}
                options={workoutTypes}
                className="selectWorkoutTypes"
              />
            </div>
            <div className="userFormContainerQuestion">
              <p>How many reps do you want to do?</p>
              <input type="text" placeholder="100,200,300" ref={equipmentRef} />
            </div>
            <div className="userFormContainerQuestion">
              <p>How many hours/minutes do you want to workout?</p>
              <input type="text" placeholder="2 " ref={hourRef} />
            </div>
            <div className="userFormContainerQuestion">
              <p>
                How many calories do you want to burn?
                <br />
                Please enter a number
              </p>
              <input type="text" placeholder="300,400,500" ref={muscleRef} />
            </div>
          </div>
          <div>
            <div className="userFormContainerQuestion">
              <p>Height (in.)</p>
              <input type="text" placeholder="64" ref={heightRef} />
            </div>
            <div className="userFormContainerQuestion">
              <p>Weight (lbs.)</p>
              <input type="text" placeholder="123" ref={weightRef} />
            </div>
            <div className="userFormContainerQuestion">
              <p>Gender</p>
              <input type="text" placeholder="Male" ref={genderRef} />
            </div>
          </div>
        </form>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default NewUserForm;
