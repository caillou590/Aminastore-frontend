// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../styles/Checkout.css";
import { FaUser, FaPhone, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart, updateCartItem } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "orange",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTailleChange = (id, taille) => {
    updateCartItem(id, { taille });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems?.length) return alert("Votre panier est vide.");

    // Vérifier que chaque produit avec tailles a bien une taille choisie
    for (const item of cartItems) {
      if (item.tailles?.length > 0 && !item.taille) {
        return alert(`Veuillez choisir une taille pour ${item.nom}`);
      }
    }

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          taille: item.taille || null, // taille bien envoyée
        })),
        total: totalPrice,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        customerAddress: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
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

  if ((!cartItems?.length) && !orderPlaced) {
    return (
      <div className="container py-5 text-center">
        <p>Votre panier est vide.</p>
      </div>
    );
  }

  return (
    <div className="checkout-container container py-4">
      {!orderPlaced ? (
        <>
          <h2 className="mb-4">Finaliser ma commande</h2>

          {/* Récapitulatif panier */}
          <div className="mb-4">
            <h4>Récapitulatif du panier</h4>
            <ul className="list-group">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    {item.nom}
                    {item.tailles && item.tailles.length > 0 && (
                      <select
                        className="form-select form-select-sm d-inline-block w-auto ms-2"
                        value={item.taille || ""}
                        onChange={(e) =>
                          handleTailleChange(item._id, e.target.value)
                        }
                        required
                      >
                        <option value="">-- Taille --</option>
                        {item.tailles.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    )}
                    {" x "}
                    {item.quantity}
                  </div>
                  <span>
                    {Number(item.prix * item.quantity).toLocaleString()} FCFA
                  </span>
                </li>
              ))}
              <li className="list-group-item fw-bold d-flex justify-content-between">
                Total : <span>{Number(totalPrice).toLocaleString()} FCFA</span>
              </li>
            </ul>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">
                <FaUser /> Nom complet
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Nom complet"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                <FaPhone /> Numéro de téléphone
              </label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">
                <FaMapMarkerAlt /> Adresse de livraison
              </label>
              <textarea
                name="address"
                className="form-control"
                placeholder="Adresse de livraison"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                <FaMoneyBillWave /> Méthode de paiement
              </label>
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
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Patientez..." : "Passer la commande"}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="alert alert-success text-center">
          <h4>✅ Commande enregistrée !</h4>
          <p>Merci pour votre commande. Nous vous contacterons bientôt.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
