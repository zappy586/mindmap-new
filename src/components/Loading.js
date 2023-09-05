import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import ForceGraph3D from "react-force-graph-3d";

const DynamicGraph = () => {
  const [data, setData] = useState({ nodes: [{ id: 0 }], links: [] });

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new connected node every second
      setData(({ nodes, links }) => {
        const id = nodes.length;
        return {
          nodes: [...nodes, { id }],
          links: [
            ...links,
            { source: id, target: Math.round(Math.random() * (id - 1)) },
          ],
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback((node) => {
    setData((prevData) => {
      const newLinks = prevData.links.filter(
        (l) => l.source !== node && l.target !== node
      );
      const newNodes = prevData.nodes.filter((n) => n.id !== node.id);
      newNodes.forEach((n, idx) => {
        n.id = idx;
      });
      return { nodes: newNodes, links: newLinks };
    });
  }, []);

  return (
    <ForceGraph3D
      enableNodeDrag={false}
      onNodeClick={handleClick}
      graphData={data}
    />
  );
};

export default DynamicGraph;