import React from 'react';

const UserInfoCard = ({ username, email }) => {
  return (
    <div className="text-center">
      <p className="text-lg font-medium text-gray-700">{username}</p>
      <p className="text-sm text-gray-500">{email}</p>
    </div>
  );
};

export default UserInfoCard;
