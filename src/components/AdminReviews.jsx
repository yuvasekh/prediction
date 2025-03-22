import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
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

  const lineChartData = Object.keys(sentimentCountByProduct).map((productId) => ({
    productId: `P${productId}`,
    positive: sentimentCountByProduct[productId]?.positive || 0,
    neutral: sentimentCountByProduct[productId]?.neutral || 0,
    negative: sentimentCountByProduct[productId]?.negative || 0,
  }));

  const radarChartData = Object.keys(sentimentCountByProduct).map((productId) => ({
    subject: `P${productId}`,
    Positive: sentimentCountByProduct[productId]?.positive || 0,
    Neutral: sentimentCountByProduct[productId]?.neutral || 0,
    Negative: sentimentCountByProduct[productId]?.negative || 0,
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
            {['Pie Chart by Product', 'Search Reviews', 'Line Chart', 'Radar Chart'].map((tab, index) => (
              <Tab key={index} className={({ selected }) => selected ? "px-4 py-2 bg-blue-600 text-white rounded-lg" : "px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"}>{tab}</Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Pie Chart Tab */}
            <Tab.Panel className="flex flex-col items-center">
              <PieChart width={400} height={400}>
                <Pie data={lineChartData} cx="50%" cy="50%" outerRadius={100} dataKey="positive">
                  {lineChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </Tab.Panel>

            {/* Search Review Tab */}
            <Tab.Panel className="flex flex-col items-center">
              <input type="number" placeholder="Enter Review ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300" />
              <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Search</button>
              {searchResult && (
                <p className="font-medium">Review: {searchResult.text} {searchResult.sentiment === "positive" ? "😀" : "😞"}</p>
              )}
            </Tab.Panel>

            {/* Line Chart Tab */}
            <Tab.Panel className="flex justify-center">
              <LineChart width={500} height={300} data={lineChartData}>
                <XAxis dataKey="productId" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="positive" stroke="#00C49F" />
                <Line type="monotone" dataKey="neutral" stroke="#FFBB28" />
                <Line type="monotone" dataKey="negative" stroke="#FF8042" />
              </LineChart>
            </Tab.Panel>

            {/* Radar Chart Tab */}
            <Tab.Panel className="flex justify-center">
              <RadarChart outerRadius={90} width={500} height={400} data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar name="Positive" dataKey="Positive" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                <Radar name="Neutral" dataKey="Neutral" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
                <Radar name="Negative" dataKey="Negative" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      )}
    </div>
  );
};

export default AdminReviewDashboard;
