import React from "react";
import Create from "../components/createTask";
import ShowTasks from "../components/ShowTasks";
import "./home.css";
import { useState } from "react";

function Home() {
  const [createMenu, setCreateMenu] = useState(true);
  const handleHide = () => {
    if (createMenu) {
      setCreateMenu(false);
    } else {
      setCreateMenu(true);
    }
  };
  return (
    <div>
      {!createMenu && (
        <button onClick={handleHide} className="hide">
          Show Menu
        </button>
      )}
      {createMenu && (
        <button onClick={handleHide} className="hide">
          Hide Menu
        </button>
      )}
      <div className="home_page">
        <div className="create">{createMenu && <Create />}</div>
        <div>
          <ShowTasks />
        </div>
      </div>
    </div>
  );
}

export default Home;
