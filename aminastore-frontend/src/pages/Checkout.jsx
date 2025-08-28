import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import "../styles/Checkout.css";
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

      const res = await fetch("http://localhost:5000/api/orders", {
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
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if ((!cartItems?.length) && !orderPlaced) return <div className="container py-5 text-center"><p>Votre panier est vide.</p></div>;

  return (
    <div className="checkout-container">
      {!orderPlaced ? (
        <>
          <h2>Finaliser ma commande</h2>
          <div className="mb-4">
            <h4>Récapitulatif du panier</h4>
            <ul>
              {cartItems.map(item => (
                <li key={item._id + "-" + (item.taille || "none")}>
                  {item.nom} ({item.taille || "Taille non spécifiée"}) x {item.quantity} - {Number(item.prix * item.quantity).toLocaleString()} FCFA
                </li>
              ))}
              <li className="fw-bold">Total : {Number(totalPrice).toLocaleString()} FCFA</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="input-icon"><i><FaUser /></i>
              <input type="text" name="name" placeholder="Nom complet" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-icon"><i><FaPhone /></i>
              <input type="tel" name="phone" placeholder="Numéro de téléphone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="input-icon"><i><FaMapMarkerAlt /></i>
              <textarea name="address" placeholder="Adresse de livraison" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="input-icon"><i><FaMoneyBillWave /></i>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="orange">Orange Money</option>
                <option value="wave">Wave</option>
              </select>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Patientez..." : "Passer la commande"}
            </button>
          </form>
        </>
      ) : (
        <div className="order-success">
          <h2>✅ Commande enregistrée !</h2>
          <p>Merci <strong>{formData.name}</strong> pour votre commande.</p>
          <p>Votre commande : <strong>Commande numéro {orderNumber}</strong></p>
          <div className="payment-info">
            <p>Veuillez effectuer le paiement sur :</p>
            {formData.paymentMethod === "orange" ? (
              <p>Orange Money : <span>77 108 37 63</span></p>
            ) : (
              <p>Wave : <span>77 108 37 63</span></p>
            )}
            <p>Après paiement, nous vous contacterons au <span>{formData.phone}</span>.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
