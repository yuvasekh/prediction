import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import AdminReviews from "./components/AdminReviews";
import Header from "./components/Header";
const App = () => {
  return (
    <Router>
        <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin/dashboard" element={<AdminReviews />} />
      </Routes>
    </Router>
  );
};

export default App;
