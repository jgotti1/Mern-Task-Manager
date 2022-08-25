import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./ShowTasks.css";
import { fetchPath } from "../hooks/fetchPaths";
import { useAuthContext } from "../hooks/useAuthContext";
// import * as XLSX from "xlsx/xlsx.mjs";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export default function ShowOrdersAdmin() {
  const [taskList, setTaskList] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();

  //Delete single Apparel item handling
  const deleteApparel = async (id) => {
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
  //Delete ALL Apparel handling use CAUTION

  // handle custom search

  const handleSearch = (e) => {
    // e.preventDefault();
    // console.log(search);
    // console.log(apparelList);
    // const resultsArray = apparelList.filter(
    //   (apparel) =>
    //     apparel.name.includes(search) ||
    //     apparel.appareltype.includes(search) ||
    //     apparel.size.includes(search) ||
    //     apparel.payment.includes(search) ||
    //     apparel.ispaid.includes(search)
    // );
    // setApparelList(resultsArray);
    // return apparelList;
  };

  // Mark as paid

  const handlePaid = async (id) => {
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
    console.log(json.ispaid);

    if (json.ispaid === "NO") {
      console.log("NO was not paid change to paid");
      const name = json.name;
      const appareltype = json.appareltype;
      const size = json.size;
      const payment = json.ispaid;
      const ispaid = "YES";
      const change = { name, appareltype, size, payment, ispaid };
      console.log(change);

      ////////////////////////// NOT Patch paid change
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
    if (json.ispaid === "YES") {
      console.log("YES is paid change to NOT");

      const name = json.name;
      const appareltype = json.appareltype;
      const size = json.size;
      const payment = json.ispaid;
      const ispaid = "NO";
      const change = { name, appareltype, size, payment, ispaid };
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

  //Show NOT Paid
  const handleNotPaid = async (e) => {
    // e.preventDefault();
    // const response = await fetch(fetchPath, {
    //   headers: { Authorization: `Bearer ${user.token}` },
    // });
    // const json = await response.json();
    // if (response.ok) {
    //   const noResults = json.filter((results) => results.ispaid.includes("NO"));
    //   setApparelList(noResults);
    // }
  };

  //Show Paid
  const handleYesPaid = async (e) => {
    // e.preventDefault();
    // const response = await fetch(fetchPath, {
    //   headers: { Authorization: `Bearer ${user.token}` },
    // });
    // const json = await response.json();
    // if (response.ok) {
    //   const yesResults = json.filter((results) => results.ispaid.includes("YES"));
    //   setApparelList(yesResults);
    // }
  };

  //Show All
  const showAll = async (e) => {
    window.location.reload(false);
  };

  //Export to Excel
  const handleExport = () => {
    // const wb = XLSX.utils.book_new(),
    //   ws = XLSX.utils.json_to_sheet(apparelList);
    // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    // XLSX.writeFile(wb, "Apparel.xlsx");
  };

  //fetch all orders on load
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
      <h1>All Tasks</h1>
      <div className="adminFilters">
        <button variant="contained" color="primary" onClick={handleExport}>
          Export to Excel
        </button>
        <button variant="contained" color="primary" onClick={handleNotPaid}>
          Search NOT Paid 💲
        </button>
        <button variant="contained" color="primary" onClick={handleYesPaid}>
          Search Paid 💲
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
                {/* <TableCell align="center">
                  <IconButton
                    aria-label="paid"
                    onClick={() => {
                      handlePaid(apparel._id);
                    }}
                  >
                    <PaidRoundedIcon color="primary" />
                  </IconButton>
                </TableCell> */}
                {/* <TableCell align="center">
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      deleteApparel(apparel._id);
                    }}
                  >
                    <DeleteIcon color="primary" />
                  </IconButton>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
