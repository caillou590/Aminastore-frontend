import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        clientName,
        clientEmail,
        clientPhone,
        products: cart,
        total,
        status: "en attente",
      });
      clearCart();
      navigate("/merci");
    } catch (err) {
      setError("Erreur lors de la commande, réessayez");
    }
  };

  if (cart.length === 0) return <p className="text-center mt-4">Votre panier est vide</p>;

  return (
    <div className="container my-4">
      <h2>Passer la commande</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom complet</label>
          <input
            type="text"
            className="form-control"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Téléphone</label>
          <input
            type="tel"
            className="form-control"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>
        <h4>Total : {total} FCFA</h4>
        <button type="submit" className="btn btn-success">
          Valider la commande
        </button>
      </form>
    </div>
  );
};

export default Checkout;
