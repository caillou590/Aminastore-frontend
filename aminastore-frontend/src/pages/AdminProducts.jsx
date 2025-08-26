// src/admin/pages/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL, PRODUCTS } from "../../config/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    stock: "",
    tailles: "",
    image: null,
    video: null,
    editId: null,
  });

  // ------------------- Fetch products -------------------
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(PRODUCTS);
      let data = res.data?.products || res.data || [];

      // Transforme imageUrl et videoUrl en URLs complètes
      data = data.map(p => ({
        ...p,
        imageUrl: p.imageUrl ? `${API_URL}${p.imageUrl}` : null,
        videoUrl: p.videoUrl ? `${API_URL}${p.videoUrl}` : null,
      }));

      setProducts(data);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ------------------- Form handling -------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData(prev => ({ ...prev, [name]: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "editId" && formData[key]) fd.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("adminToken");
      if (formData.editId) {
        await axios.put(`${PRODUCTS}/${formData.editId}`, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Produit mis à jour !");
      } else {
        await axios.post(PRODUCTS, fd, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Produit ajouté !");
      }

      setFormData({
        nom: "",
        description: "",
        prix: "",
        categorie: "",
        stock: "",
        tailles: "",
        image: null,
        video: null,
        editId: null,
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement du produit");
    }
  };

  // ------------------- Edit product -------------------
  const loadProductForEdit = (p) => {
    setFormData({
      nom: p.nom,
      description: p.description,
      prix: p.prix,
      categorie: p.categorie,
      stock: p.stock,
      tailles: Array.isArray(p.tailles) ? p.tailles.join(", ") : p.tailles || "",
      image: null,
      video: null,
      editId: p._id,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ------------------- Delete handlers -------------------
  const deleteImage = async (productId) => {
    if (!window.confirm("Supprimer l'image de ce produit ?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${PRODUCTS}/${productId}/image`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Image supprimée !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression image");
    }
  };

  const deleteVideo = async (productId) => {
    if (!window.confirm("Supprimer la vidéo de ce produit ?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${PRODUCTS}/${productId}/video`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Vidéo supprimée !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression vidéo");
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm("Supprimer ce produit définitivement ?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${PRODUCTS}/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
      alert("Produit supprimé !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression produit");
    }
  };

  // ------------------- Render -------------------
  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des Produits</h2>

      {/* Formulaire ajout/édition */}
      <form onSubmit={handleSubmit} className="mb-5 border p-3 rounded shadow-sm">
        <h5>{formData.editId ? "Modifier le produit" : "Ajouter un produit"}</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <input className="form-control mb-2" placeholder="Nom" name="nom" value={formData.nom} onChange={handleChange} required />
            <input className="form-control mb-2" placeholder="Prix" type="number" name="prix" value={formData.prix} onChange={handleChange} required />
            <input className="form-control mb-2" placeholder="Catégorie" name="categorie" value={formData.categorie} onChange={handleChange} required />
            <input className="form-control mb-2" placeholder="Stock" type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <textarea className="form-control mb-2" placeholder="Description" name="description" value={formData.description} onChange={handleChange} required />
            <input className="form-control mb-2" placeholder="Tailles (séparées par virgule)" name="tailles" value={formData.tailles} onChange={handleChange} />
            <input className="form-control mb-2" type="file" name="image" accept="image/*" onChange={handleChange} />
            <input className="form-control mb-2" type="file" name="video" accept="video/*" onChange={handleChange} />
          </div>
        </div>
        <button className="btn btn-success">{formData.editId ? "Modifier" : "Ajouter"}</button>
      </form>

      {/* Liste des produits */}
      {products.length === 0 ? (
        <p>Aucun produit disponible</p>
      ) : (
        <ul className="space-y-4">
          {products.map(p => (
            <li key={p._id} className="border rounded p-3 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div className="flex flex-col md:flex-row md:gap-4 items-center">
                {p.imageUrl && <img src={p.imageUrl} alt={p.nom} style={{ width: 80, height: 80, objectFit: "cover" }} className="rounded" />}
                <div>
                  <p className="font-semibold">{p.nom}</p>
                  <p className="text-red-600">{p.prix.toLocaleString()} FCFA</p>
                  {p.tailles && <p className="text-muted">Tailles: {Array.isArray(p.tailles) ? p.tailles.join(" | ") : p.tailles}</p>}
                </div>
              </div>

              {p.videoUrl && <video src={p.videoUrl} controls style={{ width: 150, height: 80, objectFit: "cover" }} className="rounded" />}

              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-primary btn-sm" onClick={() => loadProductForEdit(p)}>Modifier</button>
                {p.imageUrl && <button className="btn btn-danger btn-sm" onClick={() => deleteImage(p._id)}>Supprimer l'image</button>}
                {p.videoUrl && <button className="btn btn-warning btn-sm" onClick={() => deleteVideo(p._id)}>Supprimer la vidéo</button>}
                <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>Supprimer le produit</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminProducts;
