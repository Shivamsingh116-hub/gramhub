import React from 'react';

const UserInfoCard = ({ username, email, name, bio, gender }) => {
  return (
    <div className="w-full flex flex-col items-center text-center gap-1">
      {name && <h3 className="text-lg font-semibold text-cyan-800">{name}</h3>}
      {bio && <p className="text-sm text-cyan-600 italic">{bio}</p>}
      
      <div className="mt-3 w-full px-6 py-3 rounded-md bg-blue-50 border border-cyan-100 shadow-sm">
        <p className="text-sm text-cyan-700 truncate">
          <span className="font-medium">@{username}</span>
        </p>
        <p className="text-sm text-cyan-600">{email}</p>
        {gender && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700 capitalize">
            {gender}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
