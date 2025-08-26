import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data?.products || res.data || []);
      } catch (err) {
        console.error("Erreur chargement produits :", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Chargement des produits...</p>;
  if (!products.length) return <p>Aucun produit disponible</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Tous nos produits</h2>
      <div className="row">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={{
              ...product,
              imageUrl: product.imageUrl?.startsWith("http") ? product.imageUrl : `${API_URL}${product.imageUrl}`,
              videoUrl: product.videoUrl ? (product.videoUrl.startsWith("http") ? product.videoUrl : `${API_URL}${product.videoUrl}`) : null,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
