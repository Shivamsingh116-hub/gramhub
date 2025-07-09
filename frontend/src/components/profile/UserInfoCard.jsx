import React from 'react';

const UserInfoCard = ({ username, email, name, bio, gender }) => {
  return (
    <div className="w-full flex flex-col items-center text-center gap-1">
      {name && <h3 className="text-lg font-semibold text-gray-800">{name}</h3>}
      {bio && <p className="text-sm text-gray-500 italic">{bio}</p>}
      
      <div className="mt-3 w-full px-6 py-3 rounded-md bg-gray-50 border border-gray-200 shadow-sm">
        <p className="text-sm text-gray-700 truncate">
          <span className="font-medium">@{username}</span>
        </p>
        <p className="text-sm text-gray-600">{email}</p>
        {gender && (
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 capitalize">
            {gender}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserInfoCard;
