// src/comp/Profile.jsx
import React from 'react';

function Profile({ name ="test", followingCount="45" }) {
  return (
    <div className="profile">
      <div className="profile-icon">{name.charAt(0).toUpperCase()}</div>
      <span>{name}</span>
      <span>{followingCount} following</span>
      <button>Share profile</button>
    </div>
  );
}

export default Profile;