import React from 'react';

const JsonInput = ({ error, jsonInput, setJsonInput, handleVisualize, clearData, isDarkMode }) => (
  <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
    <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Paste or type JSON data</label>
    <textarea
      value={jsonInput}
      onChange={(e) => setJsonInput(e.target.value)}
      className={`w-full h-96 p-3 rounded-lg font-mono text-sm resize-none ${isDarkMode ? 'bg-gray-800 text-green-400 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} border-2`}
    />
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    <div className="flex gap-3 mt-4">
      <button
        onClick={handleVisualize}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Generate Tree
      </button>
      <button
        onClick={clearData}
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Reset
      </button>
    </div>
  </div>
);

export default JsonInput;
