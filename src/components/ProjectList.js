import React, { useState, useContext } from "react";
import AddTask from "./AddTask";
import TaskDetails from "./TaskDetails";
import AddProject from "./AddProject";
import DeleteProject from "./DeleteProject";
import DailyTasks from "./DailyTasks";
import DeleteTask from "./DeleteTask";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { ProjectContext } from "../App";

const ProjectList = () => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteproject, setDeleteproject] = useState(null);
  const [deletetask, setDeletetask] = useState(null);
  const [deletetaskpid, setDeletetaskpid] = useState(null);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const { projects, setProjects } = useContext(ProjectContext);
  const handleDetailsClick = (task) => {
    setSelectedTask(task); // Set selected task when "Details" button is clicked
  };

  const handleCloseClick = () => {
    setSelectedTask(null); // Clear selected task when popup is closed
  };
  const handleCloseDeleteProject = () => {
    setDeleteproject(null);
  };
  const handleCloseDeleteTask = () => {
    setDeletetask(null);
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

  const toggletasks = (pid, show, e) => {
    e.preventDefault();
    let newShowValue = false;
    show === false ? (newShowValue = true) : (newShowValue = false);

    const newData = projects.map((r) => {
      if (r.pid === pid) {
        return { ...r, show: newShowValue };
      }
      return r;
    });
    setProjects(newData);
  };

  const onTaskadded = () => {
    //add details to projects object
  };

  return (
    <div className="project-list">
      <div className="subhead">
        <AddProject />
        <DailyTasks />
      </div>
      <div>Status:{status}</div>
      <div>{progress}</div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {projects !== null &&
            projects.map((project) => {
              return (
                <tr key={project.pid}>
                  <td>
                    <div className="project-name">
                      <button onClick={(e) => deleteProject(e, project.pid)}>
                        <AiOutlineDelete />
                      </button>
                      <button
                        onClick={(e) =>
                          toggletasks(project.pid, project.show, e)
                        }
                      >
                        Show / Hide Tasks
                      </button>

                      <span>{project.pname}</span>
                    </div>

                    <span className="project-desc">{project.pdescription}</span>
                    {project.show === true && (
                      <table>
                        <thead>
                          <tr>
                            <th>Task name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Details</th>
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
                          <AddTask id={project.pid} onTaskadded={onTaskadded} />
                        </tbody>
                      </table>
                    )}
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
