// src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";
import { PRODUCTS } from "../config/api.js";

const ProductList = () => {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(PRODUCTS);
        setItems(res.data?.products || res.data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const filtered = items.filter(p =>
    (p.nom || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-column flex-md-row">
        <h3 className="m-0">Boutique</h3>
        <input
          className="form-control mt-2 mt-md-0"
          style={{ maxWidth: 280 }}
          placeholder="Recherche…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="row">
        {filtered.map(p => <ProductCard key={p._id} product={p} />)}
        {!filtered.length && (
          <div className="text-muted text-center py-5">Aucun produit.</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
