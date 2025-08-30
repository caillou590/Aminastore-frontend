// src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        // Vérifie si data.products existe, sinon prends data directement
        setProducts(data.products || data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Nos Produits</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((product) => {
            const fullProduct = {
              ...product,
              imageUrl: product.imageUrl?.startsWith("http")
                ? product.imageUrl
                : `${API_URL}${product.imageUrl}`,
              videoUrl: product.videoUrl
                ? product.videoUrl.startsWith("http")
                  ? product.videoUrl
                  : `${API_URL}${product.videoUrl}`
                : null,
            };
            return <ProductCard key={product._id} product={fullProduct} />;
          })
        ) : (
          <p className="text-center">Aucun produit disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
