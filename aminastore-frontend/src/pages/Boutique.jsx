// src/pages/Boutique.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products`); // aucun limit
        setProducts(res.data?.products || res.data || []);
      } catch (err) {
        console.error("Erreur chargement produits :", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Tous les produits</h2>
      {loading ? (
        <div className="text-center py-5">Chargement…</div>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p._id} product={{ ...p, imageUrl: `${API_URL}${p.imageUrl}`, videoUrl: p.videoUrl ? `${API_URL}${p.videoUrl}` : null }} />)
          ) : (
            <div className="text-center text-muted py-5">Aucun produit disponible.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Boutique;
