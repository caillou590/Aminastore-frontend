import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const Boutique = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("tous");
  const [categoriesList, setCategoriesList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/products`, {
        params: { search, categorie, page, limit: 10 },
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/categories`);
      setCategoriesList(res.data);
    } catch (err) {
      console.error("Erreur chargement catégories :", err);
      setCategoriesList([]);
    }
  };

  useEffect(() => { fetchCategories(); }, [API_URL]);
  useEffect(() => { fetchProducts(); }, [search, categorie, page]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Boutique</h2>

      {/* Barre recherche + filtre */}
      <div className="d-flex justify-content-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          style={{ maxWidth: "300px" }}
        />
        <select
          value={categorie}
          onChange={(e) => { setCategorie(e.target.value); setPage(1); }}
          className="form-control"
          style={{ maxWidth: "200px" }}
        >
          <option value="tous">Toutes catégories</option>
          {categoriesList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Liste produits */}
      {loading ? (
        <div className="text-center py-5">Chargement…</div>
      ) : (
        <div className="row">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard
                key={p._id}
                product={{
                  ...p,
                  imageUrl: p.imageUrl.startsWith("http") ? p.imageUrl : `${API_URL}${p.imageUrl}`,
                  videoUrl: p.videoUrl ? (p.videoUrl.startsWith("http") ? p.videoUrl : `${API_URL}${p.videoUrl}`) : null,
                }}
              />
            ))
          ) : (
            <div className="text-center text-muted py-5">Aucun produit disponible.</div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4 gap-2">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant</button>
        </div>
      )}
    </div>
  );
};

export default Boutique;
