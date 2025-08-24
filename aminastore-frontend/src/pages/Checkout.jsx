// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cartItems = [], updateQuantity, totalPrice = 0 } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("wave");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    const newErrors = {};
    if (!form.nom) newErrors.nom = "Nom requis";
    if (!form.email) newErrors.email = "Email requis";
    if (!form.telephone) newErrors.telephone = "Téléphone requis";
    if (!form.adresse) newErrors.adresse = "Adresse requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuantityChange = (productId, value) => {
    const qty = parseInt(value);
    if (qty > 0) updateQuantity(productId, qty);
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/payment", {
        cartItems,
        totalPrice,
        client: form,
        method: paymentMethod,
      });

      if (res.data?.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        alert("Erreur lors de l'initiation du paiement.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
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
      <h3 className="mb-4">Passer la commande</h3>
      <div className="row">
        {/* Formulaire client */}
        <div className="col-md-6 mb-4">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Informations client</h5>
            <div className="mb-3">
              <label className="form-label">Nom complet</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange} className="form-control" />
              {errors.nom && <div className="text-danger small">{errors.nom}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
              {errors.email && <div className="text-danger small">{errors.email}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Téléphone</label>
              <input type="text" name="telephone" value={form.telephone} onChange={handleChange} className="form-control" />
              {errors.telephone && <div className="text-danger small">{errors.telephone}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Adresse</label>
              <textarea name="adresse" value={form.adresse} onChange={handleChange} className="form-control"></textarea>
              {errors.adresse && <div className="text-danger small">{errors.adresse}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Moyen de paiement</label>
              <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="wave">Wave</option>
                <option value="orange_money">Orange Money</option>
              </select>
            </div>

            <button type="button" className="btn btn-success w-100" onClick={handlePayment} disabled={loading}>
              {loading ? "Patientez..." : "Payer maintenant"}
            </button>
          </div>
        </div>

        {/* Résumé panier */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">Résumé du panier</h5>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item._id + "-" + item.taille} className="list-group-item d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    {item.imageUrl && (
                      <img
                        src={`http://localhost:5000${item.imageUrl}`}
                        alt={item.nom}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "5px" }}
                        className="me-3"
                      />
                    )}
                    <div>
                      <strong>{item.nom}</strong> {item.taille ? `(${item.taille})` : ""}
                      <div className="mt-1 d-flex align-items-center">
                        Quantité:{" "}
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                          style={{ width: "60px" }}
                          className="form-control d-inline-block ms-2"
                        />
                      </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
