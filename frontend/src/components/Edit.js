import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchPath, loginFetchPath } from "../hooks/fetchPaths";
import { useAuthContext } from "../hooks/useAuthContext";
import "./createTask.css";
function Edit() {
  const { state } = useLocation();
  const { user } = useAuthContext();
  const [assignTo, setAssignTo] = useState(state.assignTo);
  const [caseName, setCaseName] = useState(state.caseName);
  const [task, setTask] = useState(state.task);
  const [dueDate, setDueDate] = useState(state.dueDate);
  const [priority, setPriority] = useState(state.priority);
  const [notes, setNotes] = useState(state.notes);
  const [emptyFields, setEmptyFields] = useState([]);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  //fetch all Users on load
  useEffect(() => {
    const fetchUsers = async () => {
      console.log(state.priority);
      const response = await fetch(loginFetchPath, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setUserList(json);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  // handle EDIT task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const taskItem = { assignTo, caseName, task, dueDate, priority, notes };
    console.log(taskItem);
    const response = await fetch(fetchPath + state._id, {
      method: "PATCH",
      body: JSON.stringify(taskItem),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    console.log(json);
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      navigate("/");
    }
  };

  return (
    <div className="create-div-edit">
      <form onSubmit={handleSubmit}>
        <h2 className="task_header">Change/Update this Task</h2>

        <h5 className="required">* required field</h5>

        <label>* Assign To: </label>
        <select
          labelid="demo-simple-select-label"
          id="demo-simple-select"
          onChange={(e) => setAssignTo(e.target.value)}
          value={assignTo}
          className={emptyFields.includes("assignTo") ? "error" : ""}
        >
          <option value=""></option>
          {userList.map((user, key) => (
            <option key={key} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label>CaseName: </label>
        <input type="text" step="1" onChange={(e) => setCaseName(e.target.value)} value={caseName} className={emptyFields.includes("caseName") ? "error" : ""} />

        <label>* Task: </label>
        <input type="text" onChange={(e) => setTask(e.target.value)} value={task} className={emptyFields.includes("task") ? "error" : ""} />

        <label>* Due Date: </label>
        <input type="date" onChange={(e) => setDueDate(e.target.value)} value={dueDate} className={emptyFields.includes("dueDate") ? "error" : ""} />

        <label>* Priority: </label>
        <select
          labelid="demo-simple-select-label"
          id="demo-simple-select"
          onChange={(e) => setPriority(e.target.value)}
          value={priority}
          className={emptyFields.includes("priority") ? "error" : ""}
        >
          <option value={""}></option>
          <option value={"0-Urgent Priority"}>0-Urgent Priority</option>
          <option value={"1-Semi Urgent Priority"}> 1-Semi Urgent Priority</option>
          <option value={"2- Medium Priority"}>2-Medium Priority </option>
          <option value={"3-Low Priority"}>3-Low Priority</option>
        </select>
        <br />
        <br />
        <label> Notes: </label>
        <textarea type="text" rows="7" cols="35" onChange={(e) => setNotes(e.target.value)} value={notes} className={emptyFields.includes("notes") ? "error" : ""} />

        <br />
        <br />
        <button>Submit Update</button>
        {error && <div className="error"> {error}</div>}
      </form>
    </div>
  );
}

export default Edit;
