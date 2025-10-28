import React from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';

const TreeViewer = ({
  searchPath, setSearchPath, handleSearch, nodes, edges, 
  downloadTreeAsImage, isDarkMode, searchResult,
  hoveredNode, showCopyMessage, onNodesChange, onEdgesChange,
  onNodeMouseEnter, onNodeMouseLeave, onNodeClick, setReactFlowInstance
}) => (
  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
    <div className="mb-4">
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Search by Path</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchPath}
          onChange={(e) => setSearchPath(e.target.value)}
          placeholder="$.user.address.city"
          className={`flex-1 p-2 rounded-lg border-2 ${isDarkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Search
        </button>
        {nodes.length > 0 && (
          <button
            onClick={downloadTreeAsImage}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            title="Download tree as image"
          >
            Download
          </button>
        )}
      </div>
      {searchResult && (
        <p className={`mt-2 text-sm font-semibold ${searchResult.found ? 'text-green-600' : 'text-red-600'}`}>
          {searchResult.found ? '✓ Match found' : '✗ No match found'}
        </p>
      )}
    </div>
    <div className="h-96 border-2 border-gray-300 rounded-lg overflow-hidden relative">
      {nodes.length > 0 ? (
        <>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            onNodeClick={onNodeClick}
            onInit={setReactFlowInstance}
            fitView
            className={isDarkMode ? 'dark' : ''}
          >
            <Background />
            <Controls />
          </ReactFlow>
          {hoveredNode && (
            <div className={`absolute z-10 p-3 rounded-lg shadow-lg pointer-events-none ${isDarkMode ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-gray-900 border border-gray-300'}`}
                 style={{top:'10px',left:'10px',maxWidth:'300px'}}>
              <div className="text-xs font-semibold mb-1">Path:</div>
              <div className="text-xs font-mono mb-2 text-blue-600">{hoveredNode.data.path || 'root'}</div>
              <div className="text-xs font-semibold mb-1">Value:</div>
              <div className="text-xs font-mono text-orange-600">
                {typeof hoveredNode.data.value === 'object'  ? JSON.stringify(hoveredNode.data.value).substring(0, 50) + '...' : String(hoveredNode.data.value)}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {hoveredNode.data.isKeyNode ? 'Click to copy key:value' : hoveredNode.data.isValueNode ? 'Click to copy value' : 'Click to copy'}
              </div>
            </div>
          )}
          {showCopyMessage && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className={`px-4 py-2 rounded-lg shadow-lg ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}>
                ✓ Path copied!
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={`h-full flex items-center justify-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Generated tree will appear here
        </div>
      )}
    </div>
  </div>
);

export default TreeViewer;
