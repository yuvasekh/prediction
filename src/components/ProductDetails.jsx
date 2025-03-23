import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:5000/product/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.error(err));

    axios.get(`http://localhost:5000/reviews/${id}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));

    // Assume user is logged in and stored in localStorage
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserId(userData.userId);
      setUsername(userData.username);
    }
  }, [id]);
  console.log(product,"aa")
  const handleReviewSubmit = () => {
    if (!userId || !username) {
      alert("You must be logged in to submit a review.");
      return;
    }

    axios.post("http://localhost:5000/reviews", { productId: id, userId, username, text: review,productName:product.name })
      .then((res) => {
        setReviews([...reviews, res.data.review]);
        setReview("");
      })
      .catch((err) => console.error(err));
  };

  if (!product) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-6 py-10 mt-10  w-[100vw]">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-600 text-lg mt-2">Price: ₹{product.price}</p>

          <h3 className="mt-6 text-lg font-semibold">Leave a Review</h3>
          <textarea
            className="w-full p-2 border rounded-lg mt-2"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            onClick={handleReviewSubmit}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>

          <h3 className="mt-6 text-lg font-semibold">Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((rev, index) => (
              <p key={index} className="bg-gray-100 p-2 rounded-lg mt-2">
                <strong>{rev.username}:</strong> {rev.text}
              </p>
            ))
          ) : (
            <p className="text-gray-500 mt-2">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
