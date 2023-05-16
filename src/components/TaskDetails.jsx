import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import FormData from "form-data";
import { ProjectContext } from "../App";
import imageCompression from 'browser-image-compression';

const TaskDetails = ({ task, onCloseClick }) => {
  const [imgfile, setImgfile] = useState("");
  const [tname, setTname] = useState("");
  const [tdesc, setTdesc] = useState("");
  const [tprogress, setTprogress] = useState("");
  const [tdata, setTdata] = useState(null);
  const [adata, setAdata] = useState(null);
  const [feedback, setFeedback] = useState("GETTING DATA...");
  const { projects, setProjects } = useContext(ProjectContext);

  const handleFileChange = (event) => {
    setImgfile(event.target.files[0]);
    console.log("imgfile:"+imgfile.name)
  };

  
  const upload = (compressedImage) => {
    
    let formData = new FormData();
    setFeedback("Uploading. Please wait...")
    formData.append("jkj", compressedImage);
    console.log("compressedImage data"+compressedImage)
    formData.append("taskid", task);
    formData.append("imagename", imgfile.name.split(".")[0]);
    axios
      .post(process.env.REACT_APP_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Success ", res.data.filename);
        getassets();
        setFeedback("")
      });
  };


  async function handleImageUpload(e) {
    e.preventDefault();

    const imageFile = imgfile;
    console.log("in the handleimageupload function")
    console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
  
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
      console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
  
      upload(compressedFile); // write your own logic
    } catch (error) {
      console.log(error);
    }
  
  }


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
      )
      .then((response) => {
        const newData = projects.map((p) => {
          return {
            ...p,
            tasks: p.tasks.map((t) => {
              if (t.tid === task) {
                const newTdesc = tdesc !== "" ? tdesc : t.tdesc;
                const newTprogress = tprogress !== "" ? tprogress : t.tprogress;
                return {
                  ...t,
                  tdesc: newTdesc,
                  tprogress: newTprogress,
                };
              }
              return t;
            }),
          };
        });
        setProjects(newData);
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
      })
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
      })
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
    const domainName = process.env.REACT_APP_UPLOAD;
    const filename = filePath.substring(filePath.lastIndexOf("\\") + 1);
    const url = `${domainName}/${filename}.jpg`;
    return url;
  };

  const handleExternalLink = (e, url) => {
    console.log(url);
    e.preventDefault();
    window.open(url, "_blank");
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

        <div className="task-status">
          Status:{feedback}
          {task}
        </div>
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
                    status
                    <select
                      name="selectedProgress"
                      onChange={setTprogressvalue}
                    >
                      <option value={d.tprogress}>{d.tprogress}</option>
                      <option value="todo">Todo</option>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                    <button classname="task-details-btn" onClick={handleUpdate}>
                      Update
                    </button>
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
                      onClick={(e) =>
                        handleExternalLink(e, changefilename(a.filename))
                      }
                      placeholder={a.filename}
                    >
                      {a.filename}
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
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button classname="task-details-btn" onClick={(e) => handleImageUpload(e)}>
              Submit
            </button>
            {feedback}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
