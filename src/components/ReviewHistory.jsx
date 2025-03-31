import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaRegCommentDots } from "react-icons/fa";

const ReviewHistory = () => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/reviews/${userId}`)
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [userId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6 w-[100vw] h-[100vh]">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">Review History</h1>

        {reviews.length > 0 ? (
          <ul className="divide-y divide-gray-300">
            {reviews.map((review) => (
              <li key={review.id} className="p-4 hover:bg-gray-100 transition duration-200">
                <p className="text-gray-800 font-semibold">{review.productName}</p>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <FaRegCommentDots className="text-6xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No reviews found</p>
            <p className="text-gray-500 text-sm">Start shopping and leave your first review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewHistory;
