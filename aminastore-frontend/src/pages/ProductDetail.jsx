import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data);
        if (res.data.tailles?.length) setSelectedSize(res.data.tailles[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  if (loading) return <p className="text-center py-5">Chargement du produit...</p>;
  if (!product) return <p className="text-center py-5">Produit introuvable</p>;

  const tailles = Array.isArray(product.tailles)
    ? product.tailles
    : product.tailles?.split(",").map(t => t.trim()) || [];

  const handleAddToCart = () => {
    if (!user) {
      alert("Veuillez vous connecter pour ajouter au panier !");
      navigate("/login");
      return;
    }
    if (tailles.length && !selectedSize) {
      alert("Veuillez choisir une taille !");
      return;
    }
    addToCart({ ...product, taille: selectedSize });
    alert("Produit ajouté au panier !");
  };

  return (
    <div className="container my-5">
      <div className="row g-4">
        {/* Image / Vidéo */}
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            {product.image && (
              <img
                src={`${API_URL}${product.image}`}
                alt={product.nom}
                className="img-fluid rounded"
                style={{ maxHeight: "400px", objectFit: "contain", width: "100%" }}
              />
            )}
            {product.video && (
              <video
                className="w-100 mt-3 rounded"
                controls
                style={{ maxHeight: "400px" }}
              >
                <source src={`${API_URL}${product.video}`} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            )}
          </div>
        </div>

        {/* Détails produit */}
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h2>{product.nom}</h2>
            <p className="text-muted">{product.description}</p>
            <p className="h4 text-danger">{product.prix.toLocaleString()} FCFA</p>
            <p><strong>Stock :</strong> {product.stock}</p>
            <p><strong>Catégorie :</strong> {product.categorie}</p>

            {tailles.length > 0 && (
              <div className="mb-3">
                <label htmlFor="taille" className="form-label"><strong>Tailles :</strong></label>
                <select
                  id="taille"
                  className="form-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  {tailles.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="btn btn-primary w-100"
              onClick={handleAddToCart}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
