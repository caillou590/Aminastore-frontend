import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data.products || res.data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">🛍️ Nos Produits</h2>
      <div className="row">
        {products.length === 0 && (
          <p className="text-center text-muted">Aucun produit disponible</p>
        )}

        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={{
              ...p,
              imageUrl: p.imageUrl ? `${API_URL}${p.imageUrl}` : null,
              videoUrl: p.videoUrl ? `${API_URL}${p.videoUrl}` : null
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Boutique;
