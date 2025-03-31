import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import AdminReviews from "./components/AdminReviews";
import Header from "./components/Header";
import Profile from "./components/Profile";
import ReviewHistory from "./components/ReviewHistory";

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

const MainLayout = () => {
  const location = useLocation();

  // Hide header only on the login page
  const shouldShowHeader = location.pathname !== "/";

  return (
    <>
      {shouldShowHeader && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/reviews/:userId" element={<ReviewHistory />} />
        <Route path="/admin/dashboard" element={<AdminReviews />} />
      </Routes>
    </>
  );
};

export default App;
