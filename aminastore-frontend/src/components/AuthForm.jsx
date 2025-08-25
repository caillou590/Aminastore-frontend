// src/components/AuthForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Base URL dynamique depuis le .env
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthForm = ({ type }) => {
  const isRegister = type === "register";
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? `${API_BASE}/api/clients/register`
      : `${API_BASE}/api/clients/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister ? { nom, email, motdepasse } : { email, motdepasse }
        ),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur serveur");

      if (isRegister) {
        setMessage("✅ Inscription réussie ! Redirection vers connexion...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        // Sauvegarde token + user dans le contexte
        login(data);
        setMessage("✅ Connexion réussie ! Redirection vers panier...");
        setTimeout(() => navigate("/panier"), 800);
      }
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="card-title text-center mb-4">{isRegister ? "Inscription" : "Connexion"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="mb-3">
              <label className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={motdepasse}
                onChange={(e) => setMotdepasse(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "Masquer" : "Voir"}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        {message && <div className="alert alert-info text-center mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default AuthForm;
