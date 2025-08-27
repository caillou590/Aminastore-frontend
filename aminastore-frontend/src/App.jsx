// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";

// Layout
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

// Admin
import AdminApp from "./admin/AdminApp.jsx";

// Contextes
import { CartProvider } from "./context/CartContext.jsx";

const PublicLayout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <NavBar />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <CartProvider>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/boutique" element={<PublicLayout><ProductList /></PublicLayout>} />
        <Route path="/produit/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />

        {/* PANIER & CHECKOUT */}
        <Route path="/panier" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />

        {/* ADMIN */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* 404 */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
