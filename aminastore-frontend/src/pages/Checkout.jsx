// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../styles/Checkout.css";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "orange",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems?.length) return alert("Votre panier est vide.");

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map(item => ({ productId: item._id, quantity: item.quantity })),
        total: totalPrice,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        paymentMethod: formData.paymentMethod
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Impossible de créer la commande");

      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error("Erreur lors de la création de la commande :", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if ((!cartItems?.length) && !orderPlaced)
    return <div className="container py-5 text-center"><p>Votre panier est vide.</p></div>;

  return (
    <div className="container py-4">
      {!orderPlaced ? (
        <>
          <h2 className="mb-3">Finaliser ma commande</h2>

          <div className="mb-4">
            <h5>Récapitulatif du panier</h5>
            <ul className="list-group mb-2">
              {cartItems.map(item => (
                <li key={item._id + "-" + (item.taille || "none")} className="list-group-item d-flex justify-content-between align-items-center">
                  {item.nom} ({item.taille || "Taille non spécifiée"}) x {item.quantity}
                  <span>{(item.prix * item.quantity).toLocaleString()} FCFA</span>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between fw-bold">
                Total
                <span>{totalPrice.toLocaleString()} FCFA</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                placeholder="Nom complet"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                name="phone"
                placeholder="Numéro de téléphone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                name="address"
                placeholder="Adresse de livraison"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <select
                name="paymentMethod"
                className="form-select"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="orange">Orange Money</option>
                <option value="wave">Wave</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Patientez..." : "Passer la commande"}
            </button>
          </form>
        </>
      ) : (
        <div className="alert alert-success mt-3">
          <h4>✅ Commande enregistrée !</h4>
          <p>Merci <strong>{formData.name}</strong> pour votre commande.</p>
          <p>Veuillez effectuer le paiement via :</p>
          <p>{formData.paymentMethod === "orange" ? "Orange Money" : "Wave"} : <strong>77 108 37 63</strong></p>
          <p>Après paiement, nous vous contacterons au <strong>{formData.phone}</strong>.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
