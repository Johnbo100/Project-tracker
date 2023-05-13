import React, { useState } from "react";
import axios from "axios";

const DeleteProject = ({ pid, onCloseClick }) => {
  const [status, setStatus] = useState("");

  const confirmDelete = () => {
    axios
      .delete(process.env.REACT_APP_DELETEPROJECT, {
        params: {
          pid: pid,
        },
        timeout: 10000,
      })
      .then((response) => {
        console.log(response.data);
        setStatus("Project deleted");
        onCloseClick();
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  return (
    <div className="delete-project">
      <div className="delete-project-inner">
        <h1>Delete Project</h1>
        <h3>Are you sure you want to permanently delete this project?</h3>
        <button onClick={confirmDelete}>Yes</button>
        <button onClick={onCloseClick}>No</button>
        {status && <p>{status}</p>} {}
      </div>
    </div>
  );
};

export default DeleteProject;
