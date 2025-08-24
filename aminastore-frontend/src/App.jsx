import React from "react";
import { Routes, Route } from "react-router-dom";

// Public
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import NotFound from "./pages/NotFound.jsx";

// Layout public
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

// Admin
import AdminApp from "./admin/AdminApp.jsx";

// Contextes
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

// Private Route
import PrivateRoute from "./components/PrivateRoute.jsx";

const PublicLayout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <NavBar />
    <main className="flex-grow-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* PUBLIC */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/boutique"
            element={
              <PublicLayout>
                <ProductList />
              </PublicLayout>
            }
          />
          <Route
            path="/produit/:id"
            element={
              <PublicLayout>
                <ProductDetail />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />

          {/* PRIVATE ROUTES */}
          <Route
            path="/panier"
            element={
              <PublicLayout>
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              </PublicLayout>
            }
          />
          <Route
            path="/checkout"
            element={
              <PublicLayout>
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              </PublicLayout>
            }
          />

          {/* ADMIN */}
          <Route path="/admin/*" element={<AdminApp />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <PublicLayout>
                <NotFound />
              </PublicLayout>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
