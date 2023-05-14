import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDoneAll } from "react-icons/md";

const DailyTasks = () => {
  const [data, setData] = useState(null);
  const [dailytaskname, setDailytaskname] = useState("");
  const [setdailytasksdata, setSetdailytasksdata] = useState(null);
  const [newdate, setNewdate] = useState(null);
  const [today, setToday] = useState("");

  //add to setdailytasks table
  const adddonetask = (taskName) => {
    const date = new Date().toISOString().slice(0, 10);
    axios
      .post(process.env.REACT_APP_ADDDAILYTASK, {
        dname: taskName,
        ddate: date,
      })
      .then((response) => {
        setSetdailytasksdata((prevTasks) =>
          prevTasks.filter((task) => task.sname !== taskName)
        );
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  const deletesetdailytask = (e, sid) => {
    e.preventDefault();
    axios
      .delete(process.env.REACT_APP_DELESETDAILYTASK, {
        params: {
          sid: sid,
        },
        timeout: 10000,
      })
      .then((response) => {
        console.log(response.data);
        getallsetdailytasks();
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  //get from setdailytasks table
  const getallsetdailytasks = () => {
    axios
      .get(process.env.REACT_APP_ALLSETDAILYTASK, {
        timeout: 10000,
      })
      .then((response) => {
        console.log(response.data);
        setSetdailytasksdata(response.data);
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  const addsetdailytask = () => {
    axios
      .post(process.env.REACT_APP_ADDSETDAILYTASK, {
        sname: dailytaskname,
      })
      .then((response) => {
        console.log(response.data);
        getallsetdailytasks();
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  const setDate = () => {
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      parseInt(today.getMonth() + 1) +
      "-" +
      today.getDate();
    setNewdate(date);
    const date1 = new Date().toISOString().split("T")[0];
    return date1;
  };

  useEffect(() => {
    getallsetdailytasks();
    setToday(setDate());
  }, []);

  return (
    <div className="dailytasks">
      <div className="dailytaskscroll">
        <table>
          <thead>
            <tr>
              <th>Daily tasks</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {setdailytasksdata !== null &&
              setdailytasksdata.map((t) => {
                return (
                  <tr key={t.sid}>
                    <td>{t.sname}</td>
                    <td>
                      <button
                        value={t.sname}
                        onClick={(e) => adddonetask(t.sname)}
                      >
                        <MdDoneAll />
                      </button>
                    </td>
                    <td>
                      <button onClick={(e) => deletesetdailytask(e, t.sid)}>
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div>
          <input
            type="text"
            onChange={(e) => setDailytaskname(e.target.value)}
            placeholder="Task name"
          />
          <button onClick={addsetdailytask}>Add daily task</button>
        </div>
      </div>
    </div>
  );
};

export default DailyTasks;
