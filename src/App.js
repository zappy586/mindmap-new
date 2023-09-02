import React from "react";
import MindMap from "./components/MindMap";
import Sidebar from "./components/sidebar"; // Import the MindMap component

function App() {
  return (
    <div className="App">
      <Sidebar />
      <MindMap /> {/* Render the MindMap component */}
    </div>
  );
}

export default App;
