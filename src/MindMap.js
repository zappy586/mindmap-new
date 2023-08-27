import React, { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import ForceGraph3D from 'react-force-graph-3d';
import data from './data.json';
import color from 'color';
import { useState } from 'react';
import { SizeMe } from 'react-sizeme';

const nodeColorMappings = {
  0: 'gray',
  1: 'blue',
  2: 'green',
  3: 'purple',
};

const lightenColor = (colorStr, factor) => {
  return color(colorStr).lighten(factor).hex(); // Use color library to lighten color
};

const GraphWithCameraFocus = () => {
  const [mindMapData, setMindMapData] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  
  const fgRef = useRef();

  const fetchMindMapData = async () => {
    try {
      // Fetch the generated mind map JSON from the backend using the provided prompt
      const response = await fetch('http://localhost:8000/generate_mindmap/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedData = JSON.parse(data);
        setMindMapData(parsedData);
      } else {
        console.error('Failed to fetch mind map data');
      }
    } catch (error) {
      console.error('Error fetching mind map data:', error);
    }
  };

  useEffect(() => {
    if (prompt) {
      fetchMindMapData();
    }
  }, []);

  const handleNodeClick1 = async (node) => {
        try{
        setResponse('');
      const distance = 160;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
      
      const responseStream = await fetch('http://localhost:8000/generate_node_description/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ node_name: node.name }), // Use the AbortController signal
      });

      const reader = responseStream.body.getReader();
      const textDecoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = textDecoder.decode(value);
        setResponse((prevResponse) => prevResponse + chunk);
      }
    } 
    catch (error) {
      console.error('Error fetching response:', error);
    }
    }


  if (!mindMapData) {
    return (
      <div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your text prompt"
        />
        <button onClick={fetchMindMapData}>Generate Mind Map</button>
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <div id="graph-container" style={{ height: '100vh', width: '100%' }}>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your text prompt"
      />
      <button onClick={fetchMindMapData}>Generate Mind Map</button>
      <ForceGraph3D
        ref={fgRef}
        linkOpacity={0.5}
        graphData={mindMapData}
        //linkColor={nodeColorMappings[node.val]} // You can adjust the linkColor function as needed
        backgroundColor="#222"
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.name); // Use node.name as label
          sprite.color = nodeColorMappings[node.val];
          sprite.textHeight = 2;
          const spriteBackgroundColor = lightenColor(nodeColorMappings[node.val], 0.75); // Lighten the sprite color
          sprite.backgroundColor = spriteBackgroundColor;
          sprite.padding = 2;
          sprite.fontWeight = 'bold';
          sprite.fontFace = 'monospace';
          sprite.borderColor = nodeColorMappings[node.val];
          sprite.borderWidth = 3;
          sprite.borderRadius = 10;
          //sprite.onClick = {handleNodeClick1}
          return sprite;
        }}
        nodeRelSize={10}
        linkWidth={2}
        onNodeClick={handleNodeClick1} // Add the click handler
      />
      {response && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '10px',
            overflowY: 'scroll',
            maxHeight: '50vh',
          }}
        >
          {response}
        </div>
      )}
       {/* <div id="response-container">
        <h3>Response:</h3>
        <textarea
          id="response-textarea"
          value={response}
          readOnly
        />
        </div> */}
    </div>
  );
};

export default GraphWithCameraFocus;
