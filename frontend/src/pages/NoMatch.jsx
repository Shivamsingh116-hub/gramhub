import React from 'react';
import { Link } from 'react-router-dom';

const NoMatch = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100 text-center px-6">
      <h1 className="text-6xl font-extrabold text-cyan-700 mb-4 tracking-wide">
        404
      </h1>
      <p className="text-lg sm:text-xl text-cyan-600 opacity-90 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-block bg-cyan-600 text-white px-6 py-2 rounded-full hover:bg-cyan-700 transition-colors duration-200 text-sm font-medium shadow-md"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default NoMatch;
