import React, { useState, useEffect } from "react";
import axios from "axios";
import AddTask from "./AddTask";
import TaskDetails from "./TaskDetails";
import AddProject from "./AddProject";
import DeleteProject from "./DeleteProject";
import DailyTasks from "./DailyTasks";
import DeleteTask from "./DeleteTask";
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';

const ProjectList = () => {
  const [records, setRecords] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteproject, setDeleteproject] = useState(null);
  const [deletetask, setDeletetask] = useState(null);
  const [deletetaskpid, setDeletetaskpid] = useState(null);
  const [status, setStatus] = useState("");

  const handleDetailsClick = (task) => {
    setSelectedTask(task); // Set selected task when "Details" button is clicked
  };

  const handleCloseClick = () => {
    setSelectedTask(null); // Clear selected task when popup is closed
    getRecords();
  };
  const handleCloseDeleteProject = () => {
    setDeleteproject(null);
    getRecords();
  };
  const handleCloseDeleteTask = () => {
    setDeletetask(null);
    getRecords();
  };

  const deleteTask = (e, tid, pid) => {
    e.preventDefault();
    setDeletetaskpid(pid);
    setDeletetask(tid);
  };

  const deleteProject = (e, pid) => {
    e.preventDefault();
    setDeleteproject(pid);
  };

  const getRecords = () => {
    setStatus("Getting data");
    axios
      .get(process.env.REACT_APP_ALLPROJECTSTASKS, {
        timeout: 10000,
      })
      .then((response) => {
        console.log(response.data);
        setRecords(response.data);
        setStatus("");
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  useEffect(() => {
    getRecords();
  }, []);

  const onProjectAdded = () => {
    getRecords();
  };

  const onTaskadded = () => {
    getRecords();
  };

  return (
    <div className="project-list">
      <div className="subhead">
        <AddProject onProjectAdded={onProjectAdded} />
        <DailyTasks />
      </div>
      <div>Status:{status}</div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records !== null &&
            records.map((project) => {
              return (
                <tr key={project.pid}>
                  <td>
                    <div className="project-name">
                      <button onClick={(e) => deleteProject(e, project.pid)}>
                        <AiOutlineDelete />
                      </button>
                      <span>{project.pname}</span>
                    </div>

                    <span className="project-desc">{project.pdescription}</span>

                    <table>
                      <thead>
                        <tr>
                          <th>Task name</th>
                          <th>Description</th>
                          <th>Stat</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.tasks.map((task) => {
                          return (
                            <tr key={task.tid}>
                              <td className="task-name">{task.tname}</td>
                              <td className="task-desc">
                                {task.tdesc.length > 200
                                  ? task.tdesc.slice(0, 200).concat(".......")
                                  : task.tdesc}
                              </td>
                              <td
                                className="task-progress"
                                style={{
                                  background:
                                    task.tprogress === "todo"
                                      ? "#2b46711c"
                                      : task.tprogress === "in progress"
                                      ? "#2b467180"
                                      : task.tprogress === "completed"
                                      ? "#2b4671"
                                      : task.tprogress === "canceled"
                                      ? "gray"
                                      : "#92b0e0",
                                }}
                              >
                                {task.tprogress}
                              </td>
                              <td className="details-cell">
                                <button
                                  onClick={() => handleDetailsClick(task.tid)}
                                >
                                 <AiOutlineEdit />
                                </button>
                              </td>
                              <td className="details-cell">
                                <button
                                  onClick={(e) =>
                                    deleteTask(e, task.tid, project.pid)
                                  }
                                >
                                  <AiOutlineDelete />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <AddTask id={project.pid} onTaskadded={onTaskadded} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {selectedTask !== null && (
        <TaskDetails task={selectedTask} onCloseClick={handleCloseClick} />
      )}
      {deleteproject !== null && (
        <DeleteProject
          pid={deleteproject}
          onCloseClick={handleCloseDeleteProject}
        />
      )}
      {deletetask !== null && (
        <DeleteTask
          tid={deletetask}
          pid={deletetaskpid}
          onCloseClick={handleCloseDeleteTask}
        />
      )}
    </div>
  );
};

export default ProjectList;
