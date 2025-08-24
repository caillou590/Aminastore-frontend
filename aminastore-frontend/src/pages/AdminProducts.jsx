// src/admin/pages/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PRODUCTS } from "../../config/api";

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

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCTS);
      if (Array.isArray(res.data)) setProducts(res.data);
      else if (res.data && Array.isArray(res.data.products)) setProducts(res.data.products);
      else setProducts([]);
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

  // Delete image
  const deleteImage = async (productId) => {
    if (!window.confirm("Supprimer l'image de ce produit ?")) return;
    try {
      await axios.delete(`${PRODUCTS}/${productId}/image`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Image supprimée !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression image");
    }
  };

  // Delete video
  const deleteVideo = async (productId) => {
    if (!window.confirm("Supprimer la vidéo de ce produit ?")) return;
    try {
      await axios.delete(`${PRODUCTS}/${productId}/video`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Vidéo supprimée !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression vidéo");
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm("Supprimer ce produit définitivement ?")) return;
    try {
      await axios.delete(`${PRODUCTS}/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Produit supprimé !");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression produit");
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData(prev => ({ ...prev, [name]: files[0] }));
    else setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nom", formData.nom);
    fd.append("description", formData.description);
    fd.append("prix", formData.prix);
    fd.append("categorie", formData.categorie);
    fd.append("stock", formData.stock);
    fd.append("tailles", formData.tailles);
    if (formData.image) fd.append("image", formData.image);
    if (formData.video) fd.append("video", formData.video);

    try {
      if (formData.editId) {
        // Edit product
        await axios.put(`${PRODUCTS}/${formData.editId}`, fd, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Produit mis à jour !");
      } else {
        // Add new product
        await axios.post(PRODUCTS, fd, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  // Load product in form for editing
  const editProduct = (p) => {
    setFormData({
      nom: p.nom,
      description: p.description,
      prix: p.prix,
      categorie: p.categorie,
      stock: p.stock,
      tailles: p.tailles.join(", "),
      image: null,
      video: null,
      editId: p._id,
    });
  };

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
              {/* Info produit */}
              <div className="flex flex-col md:flex-row md:gap-4 items-center">
                {p.imageUrl && <img src={`http://localhost:5000${p.imageUrl}`} alt={p.nom} style={{ width: 80, height: 80, objectFit: "cover" }} className="rounded" />}
                <div>
                  <p className="font-semibold">{p.nom}</p>
                  <p className="text-red-600">{p.prix.toLocaleString()} CFA</p>
                </div>
              </div>

              {/* Vidéo */}
              {p.videoUrl && <video src={`http://localhost:5000${p.videoUrl}`} controls style={{ width: 150, height: 80, objectFit: "cover" }} className="rounded" />}

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                <button className="btn btn-primary btn-sm" onClick={() => editProduct(p)}>Modifier</button>
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
