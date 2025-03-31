import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis,
  LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

const AdminReviewDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductPie, setSelectedProductPie] = useState("1"); // For Pie Chart
  const [selectedProductBar, setSelectedProductBar] = useState("1"); // For Bar Chart
  const [selectedProductLine, setSelectedProductLine] = useState("1"); // For Line Chart
  const [selectedProductRadar, setSelectedProductRadar] = useState("1"); // For Radar Chart
  const [selectedProductSuggestion, setSelectedProductSuggestion] = useState("1"); // For Suggestion Tab
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:5000/reviews")
      .then((res) => {
        setReviews(JSON.parse(res.data));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    axios.get("http://localhost:5000/users")
      .then((res) => {
        console.log(res.data.users,"yuva")
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const getReviewsByUser = (userId) => {
    return reviews.filter((review) => review.userId === userId);
  };
  
  const handleSearch = () => {
    const foundReview = reviews.find((review) => review.id === parseInt(searchId, 10));
    setSearchResult(foundReview || "No review found");
  };

  // Get unique product IDs
  const productIds = [...new Set(reviews.map((review) => review.productId))];
  const uniqueProducts = [
    ...new Map(reviews.map((review) => [review.productId, { productId: review.productId, productName: review.productName }])).values()
  ];
  
  console.log(uniqueProducts,"yuva")
  // Filter reviews by selected product
  const filterReviewsByProduct = (productId) => {
    return reviews.filter((review) => review.productId === productId);
  };

  // Calculate sentiment counts for a given product
  const calculateSentimentCount = (productId) => {
    const filteredReviews = filterReviewsByProduct(productId);
    return filteredReviews.reduce((acc, review) => {
      acc[review.sentiment] = (acc[review.sentiment] || 0) + 1;
      return acc;
    }, {});
  };

  // Format data for charts
  const formatChartData = (productId) => {
    const sentimentCount = calculateSentimentCount(productId);
    return [
      { name: "Positive", value: sentimentCount.positive || 0 },
      { name: "Neutral", value: sentimentCount.neutral || 0 },
      { name: "Negative", value: sentimentCount.negative || 0 },
    ];
  };
  return (
    <div className="container  p-6 bg-gray-100 min-h-screen mt-[20] w-[100vw]">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">📊 Admin Review Dashboard</h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <Tab.Group>
          <Tab.List className="flex justify-center space-x-4 mb-6">
            {['Pie Chart', 'Bar Chart', 'Line Chart', 'Radar Chart', 'Search Reviews', 'AI Suggestions','Users'].map((tab, index) => (
              <Tab key={index} className={({ selected }) => selected ? "px-4 py-2 bg-blue-600 text-white rounded-lg" : "px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"}>{tab}</Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Pie Chart Tab */}
            <Tab.Panel className="flex flex-col items-center">
              {/* <select
                value={selectedProductPie}
                onChange={(e) => setSelectedProductPie(e.target.value)}
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300 mb-4"
              >
                {productIds.map((productId) => (
                  <option key={productId} value={productId}>Product {productId}</option>
                ))}
              </select> */}
     <select
  value={selectedProductPie}
  onChange={(e) => setSelectedProductPie(e.target.value)}
  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300 mb-4"
>
  {uniqueProducts.map(({ productId, productName }) => (
    <option key={productId} value={productId}>{productName}</option>
  ))}
</select>


              <PieChart width={400} height={400}>
                <Pie data={formatChartData(selectedProductPie)} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                  {formatChartData(selectedProductPie).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </Tab.Panel>
    
            {/* Bar Chart Tab */}
            <Tab.Panel className="flex flex-col items-center">
            <select
  value={selectedProductBar}
  onChange={(e) => setSelectedProductBar(e.target.value)}
  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300 mb-4"
>
  {uniqueProducts.map(({ productId, productName }) => (
    <option key={productId} value={productId}>{productName}</option>
  ))}
</select>

              <BarChart width={500} height={300} data={formatChartData(selectedProductBar)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </Tab.Panel>

            {/* Line Chart Tab */}
            <Tab.Panel className="flex flex-col items-center">
            
            <select
  value={selectedProductLine}
  onChange={(e) => setSelectedProductLine(e.target.value)}
  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300 mb-4"
>
  {uniqueProducts.map(({ productId, productName }) => (
    <option key={productId} value={productId}>{productName}</option>
  ))}
</select>

              <LineChart width={500} height={300} data={formatChartData(selectedProductLine)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#00C49F" />
              </LineChart>
            </Tab.Panel>

            {/* Radar Chart Tab */}
            <Tab.Panel className="flex flex-col items-center">
            <select
  value={selectedProductRadar}
  onChange={(e) => setSelectedProductRadar(e.target.value)}
  className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300 mb-4"
>
  {uniqueProducts.map(({ productId, productName }) => (
    <option key={productId} value={productId}>{productName}</option>
  ))}
</select>

              <RadarChart outerRadius={90} width={500} height={400} data={formatChartData(selectedProductRadar)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Sentiment" dataKey="value" stroke="#FF8042" fill="#FF8042" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </Tab.Panel>

            {/* Search Review Tab */}
            <Tab.Panel className="flex flex-col items-center">
              <input
                type="number"
                placeholder="Enter Review ID"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="border px-4 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
              />
              <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-[12]">Search</button>
              {searchResult && (
                <p className="font-medium text-4xl">Review: {searchResult.text} {searchResult.sentiment === "positive" ? "😀" : "😞"}</p>
              )}
            </Tab.Panel>

            {/* AI Suggestions Tab */}
            <Tab.Panel className="flex flex-col items-center">
  <button
    onClick={async () => {
      try {
        // Fetch suggestions from the API
        const response = await axios.get("http://localhost:5000/suggestion");
        const productSuggestions = response.data;

        // Set the suggestions in state
        setSuggestion(JSON.parse(productSuggestions));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestion([]); // Clear suggestions in case of error
      }
    }}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mt-[12]"
  >
    Fetch All Product Suggestions
  </button>

  {suggestion && (
    <div className="mt-6 w-full max-w-4xl">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Suggestion
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {suggestion.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                Product {item.productId}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {item.suggestion}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</Tab.Panel>


            {/* Users List Tab */}
            <Tab.Panel className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-4">Users List</h3>
              <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedUser(user.id)}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedUser && (
                <div className="mt-6 w-full max-w-4xl">
                  <h3 className="text-xl font-bold mb-4">Reviews by User {selectedUser}</h3>
                  <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getReviewsByUser(selectedUser).map((review, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700">{review.text}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{review.sentiment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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