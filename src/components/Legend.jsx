import React from 'react';

const Legend = ({ isDarkMode }) => (
  <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
    <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      Legend
    </h3>
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <div className="w-16 h-10 bg-indigo-500 rounded-lg"></div>
        <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>Object</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-10 bg-green-500 rounded-lg"></div>
        <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>Array</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-10 bg-orange-500 rounded-lg"></div>
        <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>Primitive</span>
      </div>
    </div>
  </div>
);

export default Legend;
