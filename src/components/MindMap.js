import React, { useRef, useEffect, useState } from 'react';
import SpriteText from 'three-spritetext';
import ForceGraph3D from 'react-force-graph-3d';
import color from 'color';
import './MindMap.css';
import {BsFillArrowRightCircleFill} from "react-icons/bs"
import Loading_ani from "./Loading"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


const nodeColorMappings = {
    0: '#00FF87',
    2: '#FFAA00',
    1: '#00AAFF',
    3: '#AAFF00',
  };
  
  const lightenColor = (colorStr, factor) => {
    return color(colorStr).lighten(factor).hex(); // Use color library to lighten color
  }; const darkColor = (colorStr, factor) => {
    return color(colorStr).darken(factor).hex(); // Use color library to lighten color
  };
  const reduceOpacity = (colorStr, factor) => {
    const colorObj = color(colorStr);
    const newAlpha = Math.max(0, colorObj.alpha() - factor);
    return colorObj.alpha(newAlpha).rgb().toString(); // Return the RGB representation
  };
  
const GraphWithCameraFocus = () => {
  const [mindMapData, setMindMapData] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [bgcolor, setBgcolor] = useState("#fff0");
  

  const fgRef = useRef();

  const fetchMindMapData = async () => {
    try {
      setLoading(true);

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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching mind map data:', error);
    }
  };

  useEffect(() => {
    if (prompt) {
      fetchMindMapData();
    }
  }, []);

  const handleNodeClick1 = async (node) => {
    try {
      setBgcolor( reduceOpacity(nodeColorMappings[node.val], 0.5) );
      setResponse('');
      const distance = 160;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node,
        3000
      );

      await delay(3000);

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
  };

  if (loading) {
    return (

        <>
            <Loading_ani/> 
        </>
       
      
    );
  } else if (!mindMapData) {
    return (
      <div className='container'>
        <div className='text_bar' >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your text prompt"
          />
          <button onClick={fetchMindMapData}><BsFillArrowRightCircleFill /></button>
        </div>
      </div>
      
    );
  }

  return (
    <>
     <div className='container'>
        <div className='text_bar' >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your text prompt"
          />
          <button onClick={fetchMindMapData}><BsFillArrowRightCircleFill /></button>
        </div>
      </div>  
      
      <div  className="graph-container">
      <div className="graph-wrapper">
      <ForceGraph3D
      className="graph_content_wrapper"
        ref={fgRef}
        linkOpacity={0.5}
        graphData={mindMapData}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.name);
          sprite.color = darkColor(nodeColorMappings[node.val], 0.4);
          sprite.textHeight = 2;
          const spriteBackgroundColor = nodeColorMappings[node.val];
          sprite.backgroundColor = spriteBackgroundColor;
          sprite.padding = 4;
          sprite.fontWeight = 'bold';
          sprite.fontFace = 'monospace';
          sprite.borderColor =lightenColor(nodeColorMappings[node.val], 0.75);
          sprite.borderWidth = 2;
          sprite.borderRadius = 10;
          return sprite;
        }}
        nodeRelSize={10}
        linkWidth={2}
        onNodeClick={handleNodeClick1}
        backgroundColor={bgcolor}
      />
      </div>
      {response && (
         <div className="response-container">
         {response}
       </div>
      )}
    </div>
    </>
   
  );
};

export default GraphWithCameraFocus;
