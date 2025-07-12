import React from 'react';

const Loader = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-10 h-10",
        lg: "w-16 h-16 "
    };
    return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-cyan-100">
            {/* Spinning ring */}
            <div className={`relative ${sizeClasses[size]}`}>
                <div className="absolute inset-0 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
                <div className="absolute inset-1 rounded-full bg-white"></div>
            </div>

        </div>
    );
};

export default Loader;
