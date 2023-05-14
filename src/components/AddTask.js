import React, { useState } from 'react'
import axios from 'axios'
import { GrAddCircle } from 'react-icons/gr';

const AddTask = (props) => {
    const[taskname, setTaskname]=useState('')
    const[taskdesc,setTaskdesc]=useState('')
    const[pid,setPid]=useState(props.id)
    
    const addTask = () => {
      taskname !== '' &&
      axios
        .post(process.env.REACT_APP_ADDTASK, {
          tname: taskname,
          tdesc: taskdesc,
          id: pid,
        })
        .then((response) => {
          console.log(response.data);
          setTaskname("");
          setTaskdesc("");
          props.onTaskadded();
        })
        .catch((error) => {
          console.error("There was an error" + error);
        });
    };
  return (
    <tr className='addtask'>
        <td><input type = "text" onChange={(e)=>setTaskname(e.target.value)} placeholder='task name'/> </td>
        <td><input type = "text" onChange={(e)=>setTaskdesc(e.target.value)} placeholder='task desc'/> </td>

        <td><button onClick={addTask}><GrAddCircle />Add a new task</button></td>
    </tr>
  )
}

export default AddTask