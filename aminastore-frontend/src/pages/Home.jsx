import React, { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products?limit=4`);
        setItems(res.data?.products?.slice(0, 4) || res.data?.slice(0, 4) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [API_URL]);

  return (
    <>
      <Hero />
      <div className="container my-5">
        <h2 className="text-center mb-4">Nos produits phares</h2>
        {loading ? (
          <div className="text-center py-5">Chargement…</div>
        ) : (
          <div className="row">
            {items.length > 0 ? (
              items.map((p) => (
                <ProductCard
                  key={p._id}
                  product={{
                    ...p,
                    imageUrl: p.imageUrl?.startsWith("http") ? p.imageUrl : `${API_URL}${p.imageUrl}`,
                    videoUrl: p.videoUrl ? (p.videoUrl.startsWith("http") ? p.videoUrl : `${API_URL}${p.videoUrl}`) : null,
                  }}
                />
              ))
            ) : (
              <div className="text-center text-muted py-5">Aucun produit pour le moment.</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
