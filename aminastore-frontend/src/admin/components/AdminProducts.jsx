// src/admin/pages/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTS } from "../../config/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(PRODUCTS);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data.products) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("Impossible de charger les produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-muted">Chargement des produits...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-dark">📦 Liste des Produits</h2>

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
                <span className="fw-medium">{product.nom}</span>
                <span className="fw-bold text-success">{product.prix} FCFA</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
