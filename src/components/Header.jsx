import React from 'react';

const Header = ({ isDarkMode, setIsDarkMode }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className={`sm:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      JSON Tree Visualizer
    </h1>
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`px-6 py-2 rounded-lg font-semibold ${isDarkMode
        ? 'bg-gray-700 text-white hover:bg-gray-600'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }`}
    >
      {isDarkMode ? 'Light' : 'Dark'} Mode
    </button>
  </div>
);

export default Header;
