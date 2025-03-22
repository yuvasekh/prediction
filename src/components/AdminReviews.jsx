import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

const AdminReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/reviews")
      .then((res) => {
        const parsedData = JSON.parse(res.data);
        setReviews(parsedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    const foundReview = reviews.find((review) => review.id === parseInt(searchId, 10));
    setSearchResult(foundReview || "No review found");
  };

  const sentimentCountByProduct = reviews.reduce((acc, review) => {
    if (!acc[review.productId]) acc[review.productId] = {};
    acc[review.productId][review.sentiment] = (acc[review.productId][review.sentiment] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.keys(sentimentCountByProduct[selectedProduct] || {}).map((sentiment, index) => ({
    name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1),
    value: sentimentCountByProduct[selectedProduct][sentiment],
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">📊 Admin Review Dashboard</h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-4 mb-6">
            {['Pie Chart by Product', 'Search Reviews'].map((tab, index) => (
              <Tab key={index} className={({ selected }) => selected ? "px-4 py-2 bg-blue-600 text-white rounded-lg" : "px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"}>{tab}</Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Pie Chart Tab */}
            <Tab.Panel className="flex flex-col items-center">
              <label className="mb-2 text-lg font-medium">Select Product:</label>
              <select className="mb-4 px-4 py-2 border rounded-lg" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                <option value="all">All Products</option>
                {Object.keys(sentimentCountByProduct).map((productId) => (
                  <option key={productId} value={productId}>Product {productId}</option>
                ))}
              </select>
              <PieChart width={400} height={400}>
                <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </Tab.Panel>

            {/* Search Review Tab */}
            <Tab.Panel className="flex flex-col items-center">
              <div className="flex justify-center items-center gap-3 mb-6">
                <input type="number" placeholder="Enter Review ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300" />
                <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Search</button>
              </div>
              {searchResult && (
                <div className="text-center text-lg mt-3">
                  {typeof searchResult === "string" ? (
                    <p className="text-red-500">{searchResult}</p>
                  ) : (
                    <p className="font-medium">Review: <span className="text-gray-700">{searchResult.text}</span> {searchResult.sentiment === "positive" ? "😀" : "😞"}</p>
                  )}
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </div>
  );
};

export default AdminReviewDashboard;