import React, { useEffect, useState } from "react";
import axios from "axios";
import Hero from "../components/Hero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { PRODUCTS } from "../config/api.js";

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${PRODUCTS}?page=1&limit=8`);
        setItems(res.data?.products || res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
 
  return (
    <>
      <Hero />

      <div className="container my-5">
        <h2 className="text-center mb-4">Nos produits phares</h2>
        {loading ? (
          <div className="text-center py-5">Chargement…</div>
        ) : (
          <div className="row">
            {items.map((p) => <ProductCard key={p._id} product={p} />)}
            {!items.length && <div className="text-center text-muted py-5">Aucun produit pour le moment.</div>}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
