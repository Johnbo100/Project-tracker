import React, { useState } from "react";
import axios from "axios";

const AddProject = (props) => {
  const [pname, setPname] = useState("");
  const [pdesc, setPdesc] = useState("");
  
  const addProject = () => {
    axios
      .post(process.env.REACT_APP_ADDPROJECT, {
        pname: pname,
        pdesc: pdesc,
      })
      .then((response) => {
        console.log(response.data);
        props.onProjectAdded();
        setPname("");
        setPdesc("");
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
      />
      <textarea
        value={pdesc}
        onChange={(e) => setPdesc(e.target.value)}
        placeholder="Description"
      />
      <button onClick={addProject}>Add new project</button>
    </div>
  );
};


export default AddProject;
