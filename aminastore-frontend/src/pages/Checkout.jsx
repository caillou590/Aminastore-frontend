// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { API_BASE } from "../config";
import { FaUser, FaPhone, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "orange",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems?.length) return setError("Votre panier est vide.");

    setLoading(true);
    setError("");
    try {
      const orderData = {
        products: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
        total: totalPrice,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        paymentMethod: formData.paymentMethod
      };

      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de créer la commande");

      setOrderNumber(data.order.orderNumber);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Erreur lors de la création de la commande :", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if ((!cartItems?.length) && !orderPlaced) return (
    <div className="container py-5 text-center">
      <p>{error || "Votre panier est vide."}</p>
    </div>
  );

  return (
    <div className="container my-4">
      {!orderPlaced ? (
        <>
          <h2 className="mb-4">Finaliser ma commande</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-4">
            <h4>Récapitulatif du panier</h4>
            <ul className="list-group">
              {cartItems.map(item => (
                <li key={item._id + "-" + (item.taille || "none")} className="list-group-item d-flex justify-content-between">
                  <span>{item.nom} ({item.taille || "Taille non spécifiée"}) x {item.quantity}</span>
                  <span>{(item.prix * item.quantity).toLocaleString()} FCFA</span>
                </li>
              ))}
              <li className="list-group-item fw-bold d-flex justify-content-between">
                Total : <span>{totalPrice.toLocaleString()} FCFA</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nom complet</label>
              <div className="input-group">
                <span className="input-group-text"><FaUser /></span>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label>Numéro de téléphone</label>
              <div className="input-group">
                <span className="input-group-text"><FaPhone /></span>
                <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label>Adresse de livraison</label>
              <div className="input-group">
                <span className="input-group-text"><FaMapMarkerAlt /></span>
                <textarea name="address" className="form-control" value={formData.address} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-3">
              <label>Méthode de paiement</label>
              <div className="input-group">
                <span className="input-group-text"><FaMoneyBillWave /></span>
                <select name="paymentMethod" className="form-select" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="orange">Orange Money</option>
                  <option value="wave">Wave</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Patientez..." : "Passer la commande"}
            </button>
          </form>
        </>
      ) : (
        <div className="alert alert-success text-center">
          <h2>✅ Commande enregistrée !</h2>
          <p>Merci <strong>{formData.name}</strong> pour votre commande.</p>
          <p>Commande numéro : <strong>{orderNumber}</strong></p>
          <p>Veuillez effectuer le paiement via {formData.paymentMethod === "orange" ? "Orange Money" : "Wave"} au 77 108 37 63.</p>
          <p>Après paiement, nous vous contacterons au <strong>{formData.phone}</strong>.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
