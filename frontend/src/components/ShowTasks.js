import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IconButton } from "@mui/material";
import "./ShowTasks.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RuleFolderIcon from "@mui/icons-material/RuleFolder";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { fetchPath } from "../hooks/fetchPaths";
import { useAuthContext } from "../hooks/useAuthContext";
import * as XLSX from "xlsx/xlsx.mjs";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function ShowOrdersAdmin() {
  const [taskList, setTaskList] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  //Delete single TASK item handling
  const deleteTask = async (id) => {
    if (!user) {
      return;
    }

    const response = await fetch(`${fetchPath}${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      window.location.reload(false);
    }
  };

  // handle custom search

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(search);
    console.log(taskList);
    const resultsArray = taskList.filter(
      (task) =>
        task.assignTo.includes(search) ||
        task.assignedBy.includes(search) ||
        task.caseName.includes(search) ||
        task.task.includes(search) ||
        task.completed.includes(search) ||
        task.dueDate.includes(search) ||
        task.priority.includes(search) ||
        task.notes.includes(search)
    );
    setTaskList(resultsArray);
    return taskList;
  };

  // Mark as Complete or NOT complete

  const handleComplete = async (id) => {
    const response = await fetch(fetchPath + id, {
      method: "Get",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      console.log(json.error);
    }
    console.log(json.completed);

    if (json.completed === "NO") {
      console.log("NO was not Completed  change to completed");

      const completed = "YES";
      const change = { completed };
      console.log(change);

      ////////////////////////// NOT Patch completed change
      const res = await fetch(fetchPath + id, {
        method: "PATCH",
        body: JSON.stringify(change),
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const results = await res.json();
      console.log(results);

      if (!response.ok) {
        console.log(json.error);
      }
      if (response.ok) {
        console.log("change made");
        window.location.reload(false);
      }
    }
    if (json.completed === "YES") {
      console.log("YES is completed change to NOT");

      const completed = "NO";
      const change = { completed };
      console.log(change);

      ///////////////////////////////////// IS Patch paid change
      const res = await fetch(fetchPath + id, {
        method: "PATCH",
        body: JSON.stringify(change),
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const results = await res.json();
      console.log(results);

      if (!response.ok) {
        console.log(json.error);
      }
      if (response.ok) {
        console.log("change made");
        window.location.reload(false);
      }
    }
  };

  //Show NOT Completed
  const handleNotCompleted = async (e) => {
    e.preventDefault();
    const response = await fetch(fetchPath, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      const noResults = json.filter((results) => results.completed.includes("NO"));
      setTaskList(noResults);
    }
  };
  //Show My Tasks
  const handleMyTasks = async (e) => {
    e.preventDefault();
    console.log(user.name);
    const response = await fetch(fetchPath, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      const myTasks = json.filter((results) => results.assignTo.includes(user.userName) && results.completed.includes("NO"));
      setTaskList(myTasks);
    }
  };

  //Show Complete
  const handleYesComplete = async (e) => {
    e.preventDefault();
    const response = await fetch(fetchPath, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      const yesResults = json.filter((results) => results.completed.includes("YES"));
      setTaskList(yesResults);
    }
  };
  //Show Urgent open
  const handleShowUrgent = async (e) => {
    e.preventDefault();
    const response = await fetch(fetchPath, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      const yesResults = json.filter((results) => results.priority.includes("0-U"));
      setTaskList(yesResults);
    }
  };
  //Edit Task
  const handleEdit = async (id) => {
    const response = await fetch(`${fetchPath}${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    const json = await response.json();
    if (response.ok) {
      const editResults = json;
      navigate("/edit", { state: editResults });
      console.log(editResults);
    }
  };

  //Show All
  const showAll = async (e) => {
    window.location.reload(false);
  };

  //Export to Excel
  const handleExport = () => {
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(taskList);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "TaskTracker.xlsx");
  };

  //fetch all Tasks on load
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(fetchPath, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setTaskList(json);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="show_all">
      <h1>Task Tracker</h1>
      <div className="adminFilters">
        <button variant="contained" color="primary" onClick={handleExport}>
          Export to Excel
        </button>
        <button variant="contained" color="primary" onClick={handleMyTasks}>
          Search My Open Tasks
        </button>
        <button variant="contained" color="primary" onClick={handleShowUrgent}>
          Search All Ugent and Open
        </button>
        <button variant="contained" color="primary" onClick={handleNotCompleted}>
          Search All NOT Completed ❌
        </button>
        <button variant="contained" color="primary" onClick={handleYesComplete}>
          Search All Completed ☑️
        </button>
        <button variant="contained" color="primary" onClick={showAll}>
          Clear Searches
        </button>
        <div className="search_form">
          <form onSubmit={handleSearch} className="search">
            <label>
              <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
            </label>
          </form>
        </div>
      </div>
      <TableContainer className="show_tasks">
        <Table aria-label="simple table">
          <TableHead className="top_row">
            <TableRow>
              <TableCell align="center">
                <h4>Assigned To</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Assigned By</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Case Name</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Task</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Due Date</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Priority</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Completed</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Created</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Notes</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Mark Complete/Not Complete</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Delete Task</h4>
              </TableCell>
              <TableCell align="center">
                <h4>Edit Task</h4>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {taskList.map((task, key) => (
              <TableRow key={key}>
                <TableCell align="center">{task.assignTo}</TableCell>
                <TableCell align="center">{task.assignedBy}</TableCell>
                <TableCell align="center">{task.caseName}</TableCell>
                <TableCell align="center">{task.task}</TableCell>
                <TableCell align="center">{task.dueDate}</TableCell>
                <TableCell align="center">{task.priority}</TableCell>
                <TableCell align="center">{task.completed}</TableCell>
                <TableCell align="center">{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="notes" align="center">
                  {task.notes}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      },
                    }}
                    className="iconcomp icons"
                    aria-label="complete"
                    onClick={() => {
                      handleComplete(task._id);
                    }}
                  >
                    <RuleFolderIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    sx={{
                      "&:hover": {
                        backgroundColor: "transparent",
                        cursor: "pointer",
                      },
                    }}
                    className="icons"
                    aria-label="delete"
                    onClick={() => {
                      deleteTask(task._id);
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
                      <TableCell align="center">
                        <IconButton
                          sx={{
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "blue",
                              cursor: "pointer",
                            },
                          }}
                          className="iconcomp icons"
                          aria-label="complete"
                          onClick={() => {
                            handleEdit(task._id);
                          }}
                        >
                          <ModeEditIcon />
                        </IconButton>
                      </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
