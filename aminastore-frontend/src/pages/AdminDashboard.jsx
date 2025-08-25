// src/admin/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ gérer sidebar mobile
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    stock: "",
    tailles: "",
    imageUrl: "",
    videoUrl: ""
  });

  // Charger produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/products`);
        setProducts(res.data.products || res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Gérer inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ajouter produit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.post(`${API_BASE}/api/products`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([res.data, ...products]);
      setFormData({
        nom: "",
        description: "",
        prix: "",
        categorie: "",
        stock: "",
        tailles: "",
        imageUrl: "",
        videoUrl: ""
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du produit");
    }
  };

  // Supprimer produit
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h2>Aminastore</h2>
        <nav>
          <ul>
            <li>📦 Produits</li>
            <li>👥 Clients</li>
            <li>📊 Statistiques</li>
            <li>⚙️ Paramètres</li>
          </ul>
        </nav>
      </aside>

      {/* Bouton menu mobile */}
      <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Contenu principal */}
      <main className="dashboard">
        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <h2>Ajouter un produit</h2>
          <input type="text" name="nom" placeholder="Nom du produit" value={formData.nom} onChange={handleChange} required />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input type="number" name="prix" placeholder="Prix" value={formData.prix} onChange={handleChange} required />
          <input type="text" name="categorie" placeholder="Catégorie" value={formData.categorie} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <input type="text" name="tailles" placeholder="Tailles (séparées par des virgules)" value={formData.tailles} onChange={handleChange} />
          <input type="text" name="imageUrl" placeholder="URL de l’image" value={formData.imageUrl} onChange={handleChange} required />
          <input type="text" name="videoUrl" placeholder="URL de la vidéo (optionnel)" value={formData.videoUrl} onChange={handleChange} />
          <button type="submit">Ajouter le produit</button>
        </form>

        {/* Liste des produits */}
        <div className="product-list">
          <h2>Liste des produits</h2>
          {products.length === 0 && <p>Aucun produit disponible</p>}
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              {product.imageUrl && <img src={`${API_BASE}${product.imageUrl}`} alt={product.nom} />}
              {product.videoUrl && (
                <video controls>
                  <source src={`${API_BASE}${product.videoUrl}`} type="video/mp4" />
                  Votre navigateur ne supporte pas la vidéo.
                </video>
              )}
              <h4>{product.nom}</h4>
              <p>{product.description}</p>
              <p><strong>Prix:</strong> {product.prix?.toLocaleString()} FCFA | <strong>Stock:</strong> {product.stock}</p>
              <p><strong>Catégorie:</strong> {product.categorie}</p>
              {product.tailles && <p><strong>Tailles:</strong> {product.tailles.split(",").join(" | ")}</p>}
              <div className="actions">
                <button className="edit">Modifier</button>
                <button className="delete" onClick={() => handleDelete(product._id)}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
