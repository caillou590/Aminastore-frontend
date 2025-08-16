// src/admin/pages/AdminLogin.jsx
import React, { useState, useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const { loginAdmin } = useContext(AdminAuthContext);
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(email, motdepasse);
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion Admin</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={motdepasse} onChange={(e) => setMotdepasse(e.target.value)} placeholder="Mot de passe" />
      <button type="submit">Se connecter</button>
    </form>
  );
}

export default AdminLogin;
