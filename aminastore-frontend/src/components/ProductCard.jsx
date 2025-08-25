import React from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProductCard = ({ product }) => (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div className="card h-100 shadow-sm">
      {product.imageUrl ? (
        <img
          src={product.imageUrl.startsWith("http") ? product.imageUrl : `${API_URL}${product.imageUrl}`}
          alt={product.nom}
          className="card-img-top"
          style={{ height: 220, objectFit: "cover" }}
        />
      ) : (
        <img
          src="https://via.placeholder.com/400x400?text=Produit"
          alt="Produit par défaut"
          className="card-img-top"
          style={{ height: 220, objectFit: "cover" }}
        />
      )}

      {product.videoUrl && (
        <video
          controls
          className="w-100 mt-2"
          style={{ height: 220, objectFit: "cover", borderRadius: "4px" }}
        >
          <source src={product.videoUrl.startsWith("http") ? product.videoUrl : `${API_URL}${product.videoUrl}`} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>
      )}

      <div className="card-body text-center">
        <h6 className="card-title mb-1">{product.nom}</h6>
        <small className="text-muted d-block mb-2">{product.categorie || ""}</small>
        <div className="fw-bold text-danger mb-3">{product.prix?.toLocaleString()} FCFA</div>
        <Link to={`/produit/${product._id}`} className="btn btn-outline-dark btn-sm">
          Voir le produit
        </Link>
      </div>
    </div>
  </div>
);

export default ProductCard;
