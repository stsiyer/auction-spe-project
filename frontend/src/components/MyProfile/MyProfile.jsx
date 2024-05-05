import React, { useState, useEffect } from 'react';

const MyProfile = () => {
  const [userData, setUserData] = useState({}); // State to store user data

  useEffect(() => {
    // Fetch user data from your API or local storage
    const fetchUserData = async () => {
      const response = await fetch('/api/user'); // Replace with your API endpoint
      const data = await response.json();
      setUserData(data);
    };

    fetchUserData();
  }, []); // Empty dependency array: Fetch data only on component mount

  return (
    <div className="my-profile">
      <h1>My Profile</h1>
      {userData && ( // Check if user data is available before rendering
        <>
          <img src={userData.avatarUrl} alt="Profile Picture" />
          <h2>{userData.name}</h2>
          <p>Email: {userData.email}</p>
          {userData.bio && ( // Conditionally render bio if available
            <p>Bio: {userData.bio}</p>
          )}
          {/* Add more profile details like location, joined date, etc. */}
          <button>Edit Profile</button>
        </>
      )}
      {!userData && <p>Loading profile data...</p>}
    </div>
  );
};

export default MyProfile;
