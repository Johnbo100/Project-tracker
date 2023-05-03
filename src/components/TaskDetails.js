import React, { useState, useEffect } from "react";
import axios from "axios";
import FormData from "form-data";
import FileViewer from "./FileViewer";

const TaskDetails = ({ task, onCloseClick }) => {
  const [file, setFile] = useState("");
  const [tname, setTname] = useState("");
  const [tdesc, setTdesc] = useState("");
  const [tprogress, setTprogress] = useState("");
  const [tdata, setTdata] = useState(null);
  const [adata, setAdata] = useState(null);
  const [feedback, setFeedback] = useState("Nothing changed yet");

  
  const handleFileChange = (event) => {
      setFile(event.target.files[0]);
  };
  
  const upload = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("jkj", file);
    formData.append("taskid", task);
    axios.post(process.env.REACT_APP_UPLOAD, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => {
      console.log("Success ", res.data.filename);
      getassets()
    });
  };
  

  const handleUpdate = () => {
    setFeedback("Processing...");
    axios
      .put(
        process.env.REACT_APP_UPDATETASK,
        {
          tid: task,
          tname: tname,
          tdesc: tdesc,
          progress: tprogress,
        },
        { timeout: 10000 }
      ) // Send AJAX request to server
      .then((response) => {
        console.table(response.data);
        setFeedback("Task updated");
      })
      .catch((error) => {
        console.error("There was an error" + error);
        setFeedback("There was an error");
      });
  };

  const gettask = () => {
    setFeedback("Getting task information ...");
    axios
      .get(process.env.REACT_APP_GETTASK, {
        params: {
          tid: task,
        },
        timeout: 10000,
      }) // Send AJAX request to server
      .then((resp) => {
        console.log(resp.data);
        setTdata(resp.data);
        setFeedback("");
      })
      .catch((error) => {
        console.error("There was an error" + error);
        setFeedback("Failed to get task info:" + error);
      });
  };

  const getassets = () => {
    setFeedback("Getting assets ...");
    axios
      .get(process.env.REACT_APP_GETASSETS, {
        params: {
          tid: task,
        },
        timeout: 10000,
      }) // Send AJAX request to server
      .then((resp) => {
        console.log(resp.data);
        setAdata(resp.data);
        setFeedback("");
      })
      .catch((error) => {
        console.error("There was an error" + error);
        setFeedback("Failed to get assets info:" + error);
      });
  };

  const handleAssetDelete = (e, id) => {
    e.preventDefault();
    axios
      .delete(process.env.REACT_APP_DELETEASSET, {
        params: {
          id: id,
        },
        timeout: 10000,
      })
      .then((response) => {
        console.log(response.data);
        getassets();
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  const setTprogressvalue = (e) => {
    setTprogress(e.target.value);
    console.log("your selected select value is " + e.target.value);
  };

  const changefilename = (path) => {
    const filePath = path;
    const domainName = process.env.REACT_APP_UPLOAD; // domain name to add before the filename
    const filename = filePath.substring(filePath.lastIndexOf("\\") + 1);
    const url = `${domainName}/${filename}`;
    return url
  };

  const handleExternalLink = (e,url) => {
    console.log(url)
    e.preventDefault()
    window.open(url, '_blank');
  };

  useEffect(() => {
    gettask();
    getassets();
  }, []);

  return (
    <div className="taskdetails">
      <div className="task-details-content">
        <button className="task-detail-close-btn" onClick={onCloseClick}>
          X Close
        </button>
        
        <div className="task-status">Status:{feedback}</div>
        <div className="edit-task-details">
          {tdata != null &&
            tdata.map((d) => {
              return (
                <>
                  <div>
                    Name:
                    <input
                      type="text"
                      defaultValue={d.tname}
                      onChange={(e) => setTname(e.target.value)}
                    />
                    status<select name="selectedProgress" onChange={setTprogressvalue}>
                    <option value={d.tprogress}>{d.tprogress}</option>
                    <option value="todo">Todo</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                  </select>
                  <button classname="task-details-btn" onClick={handleUpdate}>Update</button>
                  </div>
                  <div>
                    Desc:
                    <textarea
                      defaultValue={d.tdesc}
                      onChange={(e) => setTdesc(e.target.value)}
                    />
                  </div>
                  
                </>
              );
            })}
         
        </div>
        
        <th className="file-link-th">File links</th>
        <th></th>
        {adata != null &&
          adata.map((a) => {
            return (
              <>
                <tr>
                  <td>
                    <button
                      className="filelink" 
                      title={a.filename} 
                      onClick={(e)=>handleExternalLink(e,changefilename(a.filename))}
                      placeholder={a.filename}
                      >{a.filename}
                        </button>
                  </td>
                  <td>
                    <button onClick={(e) => handleAssetDelete(e, a.aid)}>
                      Delete
                    </button>
                  </td>
                </tr>
              </>
            );
          })}
        <div>
          <div className="add-file">
            Add a file
            <input type="file" onChange={handleFileChange} />
            <button classname="task-details-btn" onClick={(e) => upload(e)}>Submit</button>
          
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
