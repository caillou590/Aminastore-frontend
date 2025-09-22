import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("tous");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (categoryFilter !== "tous") params.categorie = categoryFilter;
      if (search) params.search = search;

      const res = await api.get("/api/products", { params });

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setError("");
    } catch (err) {
      setError("Impossible de charger les produits");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, categoryFilter, search]);

  const prevPage = () => setPage(p => Math.max(p - 1, 1));
  const nextPage = () => setPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="dashboard-content">  {/* ✅ Ajouté */}
      <div className="container mt-4">
        <h2 className="mb-4 fw-bold text-dark">📦 Liste des Produits</h2>

        {/* Filtre et recherche */}
        <div className="d-flex mb-3 gap-2 flex-wrap">
          <select
            className="form-select w-auto"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="tous">Toutes catégories</option>
            <option value="vêtements">Vêtements</option>
            <option value="chaussures">Chaussures</option>
            <option value="accessoires">Accessoires</option>
          </select>
          <input
            type="text"
            className="form-control w-auto"
            placeholder="Recherche par nom"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-center text-muted">Chargement des produits...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <p className="text-muted">Aucun produit trouvé.</p>
            ) : (
              <div className="card shadow-sm">
                <ul className="list-group list-group-flush">
                  {products.map((product) => (
                    <li
                      key={product._id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{product.nom}</span>
                      <span className="fw-bold text-success">{product.prix} FCFA</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-sm btn-secondary"
                onClick={prevPage}
                disabled={page === 1}
              >
                Précédent
              </button>
              <span>
                Page {page} / {totalPages}
              </span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={nextPage}
                disabled={page === totalPages}
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
