import React from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-6">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NoMatch;
