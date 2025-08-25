// src/admin/components/AddProduct.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getImageUrl } from "../../utils/image.js"; // utilitaire pour générer URL HTTPS

const AddProduct = ({ onProductAdded, editingProduct, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    stock: "",
    tailles: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        tailles: Array.isArray(editingProduct.tailles)
          ? editingProduct.tailles.join(",")
          : editingProduct.tailles
      });
      // URLs HTTPS pour images/vidéos existantes
      setPreviewImage(editingProduct.imageUrl ? getImageUrl(editingProduct.imageUrl) : null);
      setPreviewVideo(editingProduct.videoUrl ? getImageUrl(editingProduct.videoUrl) : null);
    }
  }, [editingProduct]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!imageFile && !editingProduct) return alert("L'image est obligatoire !");

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "tailles") {
        data.append(key, formData[key].split(",").map(t => t.trim()));
      } else {
        data.append(key, formData[key]);
      }
    });

    if (imageFile) data.append("image", imageFile);
    if (videoFile) data.append("video", videoFile);

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      };

      const url = editingProduct
        ? `${import.meta.env.VITE_API_URL}/api/products/${editingProduct._id}`
        : `${import.meta.env.VITE_API_URL}/api/products`;

      const method = editingProduct ? axios.put : axios.post;
      const res = await method(url, data, config);

      onProductAdded(res.data);

      setFormData({ nom: "", description: "", prix: "", categorie: "", stock: "", tailles: "" });
      setImageFile(null);
      setVideoFile(null);
      setPreviewImage(null);
      setPreviewVideo(null);
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h4>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</h4>
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="prix" placeholder="Prix" value={formData.prix} onChange={handleChange} required />
        <input type="text" name="categorie" placeholder="Catégorie" value={formData.categorie} onChange={handleChange} required />
        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
        <input type="text" name="tailles" placeholder="Tailles (séparées par des virgules)" value={formData.tailles} onChange={handleChange} />

        <label>Image :</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && (
          <img
            src={previewImage}
            alt="Aperçu"
            style={{ width: "150px", marginTop: "5px", borderRadius: "8px" }}
          />
        )}

        <label>Vidéo :</label>
        <input type="file" accept="video/*" onChange={handleVideoChange} />
        {previewVideo && (
          <video style={{ width: "250px", marginTop: "5px" }} controls>
            <source src={previewVideo} type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>
        )}

        <button type="submit" className="btn btn-dark" disabled={loading}>
          {loading ? "En cours..." : editingProduct ? "Modifier le produit" : "Ajouter le produit"}
        </button>
        {editingProduct && (
          <button type="button" className="btn btn-secondary mt-1" onClick={onCancel}>
            Annuler
          </button>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
