import './App.css';
import Header from './components/Header';
import ProjectList from './components/ProjectList';
import { useState, createContext, useEffect } from 'react';
import axios from "axios";

export const ProjectContext = createContext();

function App() {
  const [projects, setProjects] = useState(null);
  const [enter, setEnter] = useState(false);
  const [status, setStatus] =useState("")

  useEffect(() => {
    getRecords();
    
  }, []);

  const getRecords = () => {
    axios
      .get(process.env.REACT_APP_ALLPROJECTSTASKS, {
        timeout: 10000,
      })
      .then((response) => {
        const newData = response.data.map(item => {
          return { ...item, show: false };
        });
        setProjects(newData);
        
      })
      .catch((error) => {
        console.error("There was an error" + error);
      });
  };

  return (
    <div className="App">
      <button onClick={() => setEnter(true)} className="startbtn">-</button>
      {enter && (
        <ProjectContext.Provider value={{ status, setStatus, projects, setProjects, getRecords}}>
          <Header status={status}/>
          <ProjectList />
        </ProjectContext.Provider>
      )}
    </div>
  );
}

export default App;
