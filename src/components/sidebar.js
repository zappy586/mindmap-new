import React, { useState, useEffect } from "react";
import "./sidebar.css";

const url = "http://localhost:8000";

const Sidebar = () => {
  const [mindMaps, setMindMaps] = useState([]);

  useEffect(() => {
    fetchMindMaps();
  }, []);

  const fetchMindMaps = () => {
    fetch("http://localhost:8000/mindmaps")
      .then((response) => response.json())
      .then((data) => {
        setMindMaps(data);
      })
      .catch((error) => {
        console.error("Error fetching mind maps:", error);
      });
  };

  const deleteMindMap = (mindMapId) => {
    fetch(url + `/mindmaps/${mindMapId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message); // Log success message
        fetchMindMaps(); // Fetch updated mind maps
      })
      .catch((error) => {
        console.error("Error deleting mind map:", error);
      });
  };

  return (
    <div className="sidebar">
      <div className="logo">NoteFusion</div>
      <ul className="sidebar-nav">
        {mindMaps.map((mindMap) => (
          <li className="sidebar-item" key={mindMap._id}>
            {mindMap.mind_map_name}
            <button
              className="delete-button"
              onClick={() => deleteMindMap(mindMap._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
