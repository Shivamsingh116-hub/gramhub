import React from 'react';

const Loader = ({ size='md' }) => {
    const sizeClasses = {
        sm: "w-5 h-5 border-2",
        md: "w-10 h-10 border-4",
        lg: "w-16 h-16 border-4"
    };
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <div className={`${sizeClasses[size]} border-black border-t-transparent rounded-full animate-spin`} />
        </div>
    );
};

export default Loader;
