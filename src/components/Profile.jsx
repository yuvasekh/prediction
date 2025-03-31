import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/user/${userId}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.error("Error fetching profile:", err));
  }, [userId]);

  if (!user) return <p className="text-center text-gray-600 mt-10">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6  text-center">
        <FaUserCircle className="text-blue-600 text-6xl mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        <div className="mt-4 space-y-3">
          <p className="text-gray-700"><span className="font-semibold">Name:</span> {user.name}</p>
          <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
