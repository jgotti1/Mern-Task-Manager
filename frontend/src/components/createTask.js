import React from "react";
import { useState, useEffect } from "react";
import { fetchPath, loginFetchPath } from "../hooks/fetchPaths";
import { useAuthContext } from "../hooks/useAuthContext";
import "./createTask.css";

export default function CreateTaskForm() {
  const { user } = useAuthContext();
  const [assignTo, setAssignTo] = useState("");
  const [assignedBy, setAssignedBy] = useState(user.userName);
  const [caseName, setCaseName] = useState("");
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]);

  //fetch all Users on load
  useEffect(() => {
    const fetchUsers = async () => {
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

  // handle submit new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    setAssignedBy(user.email);
    const taskItem = { assignTo, assignedBy, caseName, task, dueDate, priority, notes };
    console.log(taskItem);
    const response = await fetch(fetchPath, {
      method: "POST",
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
      setAssignTo("");
      setAssignedBy(user.userName);
      setCaseName("");
      setTask("");
      setDueDate("");
      setPriority("");
      setNotes("");
      setError(null);
      setEmptyFields([]);
      console.log("Task Added", json);
      window.location.reload(false);
    }
  };

  return (
    <div>
      <form className="create-div" onSubmit={handleSubmit}>
        <h2 className="task_header">Add NewTask</h2>

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
        <button>Add Task</button>
        {error && <div className="error"> {error}</div>}
      </form>
    </div>
  );
}
