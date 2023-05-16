import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { ProjectContext } from "../App";

const AddProject = (props) => {
  const [pname, setPname] = useState("");
  const [pdesc, setPdesc] = useState("");
  const textarearef = useRef()
  const inputref = useRef()

  const { setStatus, getRecords} = useContext(ProjectContext);

  const addProject = () => {
    axios
      .post(process.env.REACT_APP_ADDPROJECT, {
        pname: pname,
        pdesc: pdesc,
      })
      .then((response) => {
        console.log(response.data);
        setPname("");
        inputref.current.focus()
        inputref.current.style.backgroundColor = "#7CB9E8";
        inputref.current.placeholder = "Add another Project"
        inputref.current.value = "";
        textarearef.current.value = ""
        setPdesc("");
        setStatus("New project added")
        props.onProjectAdded();
        
       
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };
  
  return (
    <div className="addproject">
      <input
        type="text"
        value={pname}
        onChange={(e) => setPname(e.target.value)}
        placeholder="Project name"
        ref={inputref}
      />
      <textarea
        value={pdesc}
        onChange={(e) => setPdesc(e.target.value)}
        placeholder="Description"
        ref={textarearef}
      />
      <button onClick={addProject}>Add new project</button>
    </div>
  );
};


export default AddProject;
