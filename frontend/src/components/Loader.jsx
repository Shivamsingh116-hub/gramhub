import React from 'react';

const Loader = () => {
    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
            <div className="w-10 h-10 border-4 border-[#d62976] border-t-transparent rounded-full animate-spin" />
        </div>
    );
};

export default Loader;
