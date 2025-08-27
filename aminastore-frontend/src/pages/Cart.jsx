import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p>Votre panier est vide.</p>
        <button className="btn btn-primary" onClick={() => navigate("/boutique")}>
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h3>Panier</h3>
      <ul className="list-group mb-3">
        {cartItems.map((item) => (
          <li
            key={item._id + "-" + (item.taille || "none")}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{item.nom}</strong> ({item.taille || "Taille non spécifiée"})
              <div className="mt-1">
                Quantité:{" "}
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item._id, parseInt(e.target.value), item.taille)
                  }
                  style={{ width: "60px" }}
                  className="form-control d-inline-block ms-2"
                />
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => removeFromCart(item._id, item.taille)}
                >
                  Supprimer
                </button>
              </div>
            </div>
            <span>{Number(item.prix * item.quantity).toLocaleString()} FCFA</span>
          </li>
        ))}
        <li className="list-group-item d-flex justify-content-between fw-bold">
          Total
          <span>{Number(totalPrice).toLocaleString()} FCFA</span>
        </li>
      </ul>

      <button className="btn btn-success" onClick={() => navigate("/checkout")}>
        Passer à la commande
      </button>
    </div>
  );
};

export default Cart;
