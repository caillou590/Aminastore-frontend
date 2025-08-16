import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération du produit :", err);
    }
  };

  if (!product) return <p className="text-center my-5">Chargement du produit...</p>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            alt={product.nom}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.nom}</h2>
          <p className="text-muted">{product.description}</p>
          <h4 className="text-danger">{product.prix} FCFA</h4>

          <button
            className="btn btn-primary my-3"
            onClick={() => addToCart(product)}
          >
            Ajouter au panier
          </button>

          <div>
            <Link to="/boutique" className="btn btn-outline-secondary mt-3">
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
