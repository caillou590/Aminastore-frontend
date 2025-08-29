// src/pages/Checkout.jsx
import React from "react";
import { useCart } from "../context/CartContext.jsx";
import "../styles/Checkout.css";
import { FaUser, FaPhone, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "orange",
  });
  const [orderPlaced, setOrderPlaced] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState(null); // nouveau état

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cartItems?.length) return alert("Votre panier est vide.");

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          taille: item.taille || null,
        })),
        total: totalPrice,
        customerName: formData.name.trim(),
        customerPhone: formData.phone.trim(),
        customerAddress: formData.address.trim(),
        paymentMethod: formData.paymentMethod,
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Impossible de créer la commande");
      }

      const data = await res.json();
      // Génération d'un numéro de commande simple si backend ne le fournit pas
      const generatedOrderNumber = data.orderNumber || Math.floor(100000 + Math.random() * 900000);

      setOrderNumber(generatedOrderNumber);
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
          {/* ... ton formulaire et récapitulatif du panier ... */}
        </>
      ) : (
        <div className="order-success text-center">
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
