import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, total, removeFromCart, clearCart } = useContext(CartContext);

  if (cart.length === 0)
    return (
      <div className="container text-center my-4">
        <h2>Votre panier est vide</h2>
        <Link to="/boutique" className="btn btn-primary mt-3">
          Retour à la boutique
        </Link>
      </div>
    );

  return (
    <div className="container my-4">
      <h2>Votre Panier</h2>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, idx) => (
            <tr key={idx}>
              <td>{item.nom}</td>
              <td>{item.prix} FCFA</td>
              <td>{item.quantity || 1}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(item._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Total : {total} FCFA</h4>
      <div className="d-flex gap-2 mt-3">
        <Link to="/checkout" className="btn btn-success">
          Passer la commande
        </Link>
        <button className="btn btn-secondary" onClick={clearCart}>
          Vider le panier
        </button>
      </div>
    </div>
  );
};

export default Cart;
