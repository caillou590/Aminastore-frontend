import React, { useEffect, useState } from "react";
import axios from "axios";

const Boutique = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products") // endpoint backend
      .then((res) => setProducts(res.data.products || res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-bold">🛍️ Nos Produits</h2>
      <div className="row">
        {products.length === 0 && (
          <p className="text-center text-muted">Aucun produit disponible</p>
        )}

        {products.map((p) => (
          <div key={p._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              {p.imageUrl && (
                <img
                  src={`http://localhost:5000${p.imageUrl}`}
                  className="card-img-top"
                  alt={p.nom}
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    maxHeight: "220px",
                    objectFit: "cover",
                  }}
                />
              )}

              {p.videoUrl && (
                <video
                  style={{ width: "100%", borderRadius: "10px 10px 0 0" }}
                  controls
                >
                  <source
                    src={`http://localhost:5000${p.videoUrl}`}
                    type="video/mp4"
                  />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark fw-semibold">{p.nom}</h5>
                <p className="card-text text-muted small">{p.description}</p>

                <div className="mt-auto">
                  <p className="fw-bold text-primary fs-5 mb-3">
                    {p.prix?.toLocaleString()} FCFA
                  </p>
                  <button className="btn btn-dark w-100">
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boutique;
