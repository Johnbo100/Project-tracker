import './App.css';
import Header from './components/Header';
import AddProject from './components/AddProject';
import ProjectList from './components/ProjectList';
import { useState } from 'react';

function App() {

  const[enter, setEnter]=useState(false)
  return (
    <div className="App">
      <button onClick={()=>setEnter(true)} className="startbtn">-</button>
      
      {enter && (
        <>
          <Header />
          <ProjectList />
        </>
      )}
      
    </div>
  );
}

export default App;
