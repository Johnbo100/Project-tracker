// Import React, useState and axios
import React, { useState } from 'react'
import axios from 'axios'

// Define DeleteProject component
const DeleteTask = ({ tid, pid, onCloseClick }) => {
  const [status, setStatus] = useState("") // State variable for displaying status message
    console.log("TID=:"+tid)
    console.log("PID=:"+pid)
   
  const confirmDelete = () => {
    axios
      .delete(process.env.REACT_APP_DELETETASK, {
        params: {
          tid: tid,
          pid:pid,
        },
        timeout: 10000,
      })
      .then((response) => {
        console.log(response.data);
        onCloseClick(); 
      })
      .catch((error) => {
        console.error("There was an error" + error);
        setStatus("Cannot delete! Each project must have one or more tasks")
      });
  }

  return (
    <div className='delete-project'>
        <div className='delete-project-inner'>
      <h1>Delete Task</h1>
      <h3>Are you sure you want to permanently delete this task?</h3>
      <button onClick={confirmDelete}>Yes</button>
      <button onClick={onCloseClick}>No</button>
      {status && <p>{status}</p>} {/* Display status message when there is one */}
    </div>
    </div>
  )
}

export default DeleteTask
