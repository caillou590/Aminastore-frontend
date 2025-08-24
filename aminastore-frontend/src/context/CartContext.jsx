// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Charge le panier depuis le localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Sauvegarde à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, taille = null) => {
    const existing = cartItems.find(
      (item) => item._id === product._id && item.taille === taille
    );

    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id && item.taille === taille
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, taille, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, quantity, taille = null) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === productId && item.taille === taille
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId, taille = null) => {
    setCartItems(cartItems.filter((item) => !(item._id === productId && item.taille === taille)));
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.prix * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
