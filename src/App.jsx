import { useState, useCallback } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';
import { sampleJSON } from './sampleJSON';
import Header from './components/Header';
import JsonInput from './components/JsonInput';
import TreeViewer from './components/TreeViewer';
import Legend from './components/Legend';

function App() {
  const [jsonInput, setJsonInput] = useState(sampleJSON);
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState('');
  const [searchPath, setSearchPath] = useState('S.user.address.city');
  const [searchResult, setSearchResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const convertPath = (path) => {
    let converted = path.replace(/^S\./, '$');
    converted = converted.replace(/\[(\d+)\]/g, '[$1]');
    return converted;
  };

  const parseJSONToTree = useCallback((data, parentId = null, depth = 0, x = 0, y = 0, path = '', counter = 0) => {
    const newNodes = [];
    const newEdges = [];
    let currentX = x;
    let currentY = y;
    let localCounter = counter;

    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        const nodeId = `node-${localCounter++}`;
        const currentPath = path ? `${path}[${index}]` : `[${index}]`;
        // Array index node
        const indexNode = {
          id: nodeId,
          position: { x: currentX, y: currentY },
          data: {
            label: `[${index}]`,
            type: 'array',
            path: currentPath,
            value: item,
            isKeyNode: true,
            arrayIndex: index
          },
          style: {
            background: '#4ade80',
            color: '#fff',
            border: '2px solid #22c55e',
            borderRadius: '8px',
            padding: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            minWidth: '80px',
            textAlign: 'center'
          },
        };
        newNodes.push(indexNode);
        if (parentId) {
          newEdges.push({
            id: `e${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            style: { stroke: '#94a3b8', strokeWidth: 2 }
          });
        }
        // Recursively process item
        const childX = currentX + 200;
        const childY = currentY;
        const { nodes: childNodes, edges: childEdges, lastY: childLastY, counter: childCounter } =
          parseJSONToTree(item, nodeId, depth + 1, childX, childY, currentPath, localCounter);
        newNodes.push(...childNodes);
        newEdges.push(...childEdges);
        currentY = childLastY + 100;
        localCounter = childCounter;
      });
    } else if (data !== null && typeof data === 'object') {
      const keys = Object.keys(data);
      keys.forEach((key, index) => {
        const value = data[key];
        const nodeId = `node-${localCounter++}`;
        const currentPath = path ? `${path}.${key}` : key;
        // Determine node type and color
        let nodeType = 'object';
        let backgroundColor = '#6366f1';
        let borderColor = '#4338ca';
        if (Array.isArray(value)) {
          nodeType = 'array';
          backgroundColor = '#4ade80';
          borderColor = '#22c55e';
        } else if (value !== null && typeof value === 'object') {
          nodeType = 'object';
          backgroundColor = '#6366f1';
          borderColor = '#4338ca';
        }
        const node = {
          id: nodeId,
          position: { x: currentX, y: currentY },
          data: {
            label: key,
            type: nodeType,
            path: currentPath,
            value: value,
            isKeyNode: true,
            keyName: key
          },
          style: {
            background: backgroundColor,
            color: '#fff',
            border: `2px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '10px',
            fontWeight: 'bold',
            fontSize: '14px',
            minWidth: '100px',
            textAlign: 'center'
          },
        };
        newNodes.push(node);
        if (parentId) {
          newEdges.push({
            id: `e${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            style: { stroke: '#94a3b8', strokeWidth: 2 }
          });
        }
        // Recursively process value
        if (Array.isArray(value) || (value !== null && typeof value === 'object')) {
          const childX = currentX + 200;
          const childY = currentY;
          const { nodes: childNodes, edges: childEdges, lastY: childLastY, counter: childCounter } =
            parseJSONToTree(value, nodeId, depth + 1, childX, childY, currentPath, localCounter);
          newNodes.push(...childNodes);
          newEdges.push(...childEdges);
          currentY = childLastY + 100;
          localCounter = childCounter;
        } else {
          // Primitive value node
          const valueNodeId = `node-${localCounter++}`;
          const displayValue = value === null ? 'null' : String(value);
          const valueNode = {
            id: valueNodeId,
            position: { x: currentX + 200, y: currentY },
            data: {
              label: displayValue,
              type: 'primitive',
              path: currentPath,
              value, isValueNode: true, isKeyNode: false, keyName: key
            },
            style: {
              background: '#fb923c',
              color: '#fff',
              border: '2px solid #f97316',
              borderRadius: '8px',
              padding: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              minWidth: '80px',
              textAlign: 'center'
            },
          };
          newNodes.push(valueNode);
          newEdges.push({
            id: `e${nodeId}-${valueNodeId}`,
            source: nodeId,
            target: valueNodeId,
            style: { stroke: '#94a3b8', strokeWidth: 2 }
          });
          currentY += 100;
        }
      });
    } else {
      // This is a primitive value
      const nodeId = `node-${localCounter++}`;
      const displayValue = data === null ? 'null' : String(data);
      const node = {
        id: nodeId,
        position: { x: currentX, y: currentY },
        data: {
          label: displayValue,
          type: 'primitive',
          path: path,
          value: data, isValueNode: true, isKeyNode: false
        },
        style: {
          background: '#fb923c',
          color: '#fff',
          border: '2px solid #f97316',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 'bold',
          fontSize: '14px',
          minWidth: '80px',
          textAlign: 'center'
        },
      };
      newNodes.push(node);
      if (parentId) {
        newEdges.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          style: { stroke: '#94a3b8', strokeWidth: 2 }
        });
      }
    }
    return { nodes: newNodes, edges: newEdges, lastX: currentX, lastY: currentY, counter: localCounter };
  }, []);

  const handleVisualize = () => {
    setError('');
    setSearchResult(null);
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonData(parsed);
      const rootNode = {
        id: 'root',
        position: { x: 50, y: 50 },
        data: {
          label: 'root', type: 'object', path: '', value: parsed, isKeyNode: false
        },
        style: {
          background: '#8b5cf6', color: '#fff', border: '2px solid #7c3aed', borderRadius: '8px', padding: '10px', fontWeight: 'bold', fontSize: '14px', minWidth: '80px', textAlign: 'center'
        },
      };
      const { nodes: newNodes, edges: newEdges } = parseJSONToTree(parsed, 'root', 0, 250, 50, '', 1);
      setNodes([rootNode, ...newNodes]);
      setEdges([...newEdges]);
    } catch (e) {
      setError('Invalid JSON: ' + e.message);
    }
  };

  const handleSearch = () => {
    if (!jsonData) {
      setSearchResult({ found: false, message: 'Please visualize JSON first' });
      return;
    }
    const convertedPath = convertPath(searchPath);
    // Try to find the path
    let found = false;
    let targetNode = null;
    for (const node of nodes) {
      if (node.data.path === searchPath.replace(/^S\./, '')) {
        targetNode = node; found = true; break;
      }
    }
    if (!found) {
      for (const node of nodes) {
        if (node.data.path === convertedPath.replace(/^\$\./, '')) {
          targetNode = node; found = true; break;
        }
      }
    }
    setSearchResult({ found, node: targetNode });
    if (found && targetNode) {
      const updatedNodes = nodes.map(node => {
        if (node.id === targetNode.id) {
          return {
            ...node,
            style: {
              ...node.style,
              background: '#fbbf24',
              border: '4px solid #f59e0b'
            }
          }
        }
        return node;
      });
      setNodes(updatedNodes);
      if (reactFlowInstance) {
        const x = targetNode.position.x,
          y = targetNode.position.y,
          currentViewport = reactFlowInstance.getViewport(),
          startZoom = currentViewport.zoom,
          targetZoom = 1.5,
          duration = 800,
          startTime = Date.now();
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentZoom = startZoom + (targetZoom - startZoom) * eased;
          reactFlowInstance.setCenter(x, y, { zoom: currentZoom });
          if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
      }
      setTimeout(() => {
        const revertedNodes = nodes.map(node => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              style: {
                ...node.style,
                background: node.data.type === 'object' ? '#6366f1' : node.data.type === 'array' ? '#4ade80' : '#fb923c',
                border: node.data.type === 'object' ? '2px solid #4338ca' : node.data.type === 'array' ? '2px solid #22c55e' : '2px solid #f97316'
              }
            }
          }
          return node;
        });
        setNodes(revertedNodes);
      }, 3000);
    }
  };

  const clearData = () => {
    setJsonData(null);
    setNodes([]);
    setEdges([]);
    setError('');
    setJsonInput('');
    setSearchResult(null);
    setSearchPath('S.user.address.city');
    setHoveredNode(null);
    setShowCopyMessage(false);
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onNodeMouseEnter = useCallback((event, node) => setHoveredNode(node), []);
  const onNodeMouseLeave = useCallback(() => setHoveredNode(null), []);
  const onNodeClick = useCallback((event, node) => {
    let textToCopy = '';
    if (node.data.isKeyNode) {
      const keyName = node.data.keyName || node.data.label;
      const value = node.data.value;
      if (value === null || value === undefined) {
        textToCopy = `${keyName}: null`;
      } else if (typeof value === 'object' || Array.isArray(value)) {
        textToCopy = JSON.stringify(value, null, 2);
      } else if (typeof value === 'string') {
        textToCopy = `${keyName}: "${value}"`;
      } else {
        textToCopy = `${keyName}: ${value}`;
      }
    } else if (node.data.isValueNode) {
      const value = node.data.value;
      textToCopy = typeof value === 'string' ? value : String(value);
    } else {
      textToCopy = node.data.path || 'root';
    }
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setShowCopyMessage(true);
        setTimeout(() => setShowCopyMessage(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  }, []);

  const downloadTreeAsImage = useCallback(async () => {
    if (!reactFlowInstance) {
      alert('Please wait for the tree to finish loading.');
      return;
    }
    try {
      const nodePositions = nodes.map(node => ({
        x: node.position.x,
        y: node.position.y,
        width: 150,
        height: 50
      }));
      if (nodePositions.length === 0) {
        alert('No nodes to download');
        return;
      }
      const minX = Math.min(...nodePositions.map(n => n.x)),
        minY = Math.min(...nodePositions.map(n => n.y)),
        maxX = Math.max(...nodePositions.map(n => n.x + n.width)),
        maxY = Math.max(...nodePositions.map(n => n.y + n.height));
      let width = maxX - minX + 100,
        height = maxY - minY + 100,
        MAX_CANVAS_SIZE = 30000,
        scale = 1;
      if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
        const scaleX = MAX_CANVAS_SIZE / width,
          scaleY = MAX_CANVAS_SIZE / height;
        scale = Math.min(scaleX, scaleY);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.fillStyle = isDarkMode ? '#111827' : '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (scale < 1) ctx.scale(scale, scale);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.font = 'bold 14px Arial';
      
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source),
          targetNode = nodes.find(n => n.id === edge.target);
        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.position.x - minX + 75, sourceNode.position.y - minY + 25);
          ctx.lineTo(targetNode.position.x - minX + 75, targetNode.position.y - minY + 25);
          ctx.stroke();
        }
      });

      nodes.forEach(node => {
        const x = node.position.x - minX, y = node.position.y - minY;
        let color = '#6366f1';
        if (node.id === 'root') color = '#8b5cf6';
        else if (node.data.type === 'array') color = '#4ade80';
        else if (node.data.type === 'primitive') color = '#fb923c';
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 150, 40);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 150, 40);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = node.data.label || 'node';
        ctx.fillText(label.substring(0, 20), x + 75, y + 20);
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to generate image. The tree might be too large.');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'json-tree.png';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Error downloading image: ' + error.message + '. The tree might be too large. Try using browser screenshot (Ctrl+Shift+I and take screenshot).');
    }
  }, [reactFlowInstance, nodes, edges, isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto p-6">
        <div className={`rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>  
          <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <JsonInput
              error={error}
              jsonInput={jsonInput}
              setJsonInput={setJsonInput}
              handleVisualize={handleVisualize}
              clearData={clearData}
              isDarkMode={isDarkMode}
            />
            <TreeViewer
              searchPath={searchPath}
              setSearchPath={setSearchPath}
              handleSearch={handleSearch}
              nodes={nodes}
              edges={edges}
              downloadTreeAsImage={downloadTreeAsImage}
              isDarkMode={isDarkMode}
              searchResult={searchResult}
              hoveredNode={hoveredNode}
              showCopyMessage={showCopyMessage}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              onNodeClick={onNodeClick}
              setReactFlowInstance={setReactFlowInstance}
            />
          </div>
          <Legend isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
