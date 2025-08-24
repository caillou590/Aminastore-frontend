import React, { useState, useEffect } from "react";
import axios from "axios";
import "./app.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ✅ gérer sidebar mobile
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    sizes: "",
    imageUrl: "",
    videoUrl: ""
  });

  // Charger produits
  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  // Gérer inputs
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  // Ajouter produit
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/products", formData)
      .then(res => {
        setProducts([...products, res.data]);
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          stock: "",
          sizes: "",
          imageUrl: "",
          videoUrl: ""
        });
      })
      .catch(err => console.error(err));
  };

  // Supprimer produit
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/products/${id}`)
      .then(() => {
        setProducts(products.filter(p => p._id !== id));
      })
      .catch(err => console.error(err));
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
          <input type="text" name="name" placeholder="Nom du produit" value={formData.name} onChange={handleChange} required />
          <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input type="number" name="price" placeholder="Prix" value={formData.price} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Catégorie" value={formData.category} onChange={handleChange} required />
          <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <input type="text" name="sizes" placeholder="Tailles (séparées par des virgules)" value={formData.sizes} onChange={handleChange} />
          <input type="text" name="imageUrl" placeholder="URL de l’image (obligatoire)" value={formData.imageUrl} onChange={handleChange} required />
          <input type="text" name="videoUrl" placeholder="URL de la vidéo (optionnel)" value={formData.videoUrl} onChange={handleChange} />
          <button type="submit">Ajouter le produit</button>
        </form>

        {/* Liste des produits */}
        <div className="product-list">
          <h2>Liste des produits</h2>
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} />}
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <p><strong>Prix:</strong> {product.price} FCFA | <strong>Stock:</strong> {product.stock}</p>
              <p><strong>Catégorie:</strong> {product.category}</p>
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
