// Import React, useState and axios
import React, { useState } from 'react'
import axios from 'axios'

// Define DeleteProject component
const DeleteProject = ({ pid, onCloseClick }) => {
  const [status, setStatus] = useState("") // State variable for displaying status message

  // Function to confirm project deletion
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
        setStatus("Project deleted"); // Set status message to show project has been deleted
        onCloseClick(); // Call onCloseClick prop to close delete project popup and refresh project list
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  }

  return (
    <div className='delete-project'>
        <div className='delete-project-inner'>
      <h1>Delete Project</h1>
      <h3>Are you sure you want to permanently delete this project?</h3>
      <button onClick={confirmDelete}>Yes</button>
      <button onClick={onCloseClick}>No</button>
      {status && <p>{status}</p>} {/* Display status message when there is one */}
    </div>
    </div>
  )
}

export default DeleteProject
