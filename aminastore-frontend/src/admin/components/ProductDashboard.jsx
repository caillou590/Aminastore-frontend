// src/admin/components/ProductDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddProduct from "./AddProduct";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la récupération des produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Ajouter produit et mise à jour instantanée
  const handleProductAdded = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du produit");
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}`,
        editProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.map((p) => (p._id === res.data._id ? res.data : p)));
      setShowModal(false);
      alert("Produit modifié avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification du produit");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Dashboard Produits</h1>

      <div className="row mt-4">
        {/* Formulaire ajout */}
        <div className="col-md-6">
          <AddProduct onProductAdded={handleProductAdded} />
        </div>

        {/* Liste produits */}
        <div className="col-md-6">
          <h2>Liste des produits</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {products.map((product) => (
                <div key={product._id} className="card p-3 d-flex flex-row align-items-center gap-3">
                  <div>
                    <img
                      src={product.imageUrl}
                      alt={product.nom}
                      style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                    />
                    {product.videoUrl && (
                      <video
                        src={product.videoUrl}
                        controls
                        style={{ width: "100px", height: "80px", display: "block", marginTop: "5px" }}
                      />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h5>{product.nom}</h5>
                    <p>{product.description}</p>
                    <p>Prix: {product.prix} € | Stock: {product.stock}</p>
                    <p>Catégorie: {product.categorie}</p>
                    {product.tailles && <p>Tailles: {product.tailles}</p>}
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-primary btn-sm" onClick={() => handleEditClick(product)}>
                      Modifier
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product._id)}>
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal modification */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Modifier le produit</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body d-flex flex-column gap-2">
                  <input type="text" name="nom" value={editProduct.nom} onChange={handleEditChange} required />
                  <textarea name="description" value={editProduct.description} onChange={handleEditChange} required />
                  <input type="number" name="prix" value={editProduct.prix} onChange={handleEditChange} required />
                  <input type="text" name="categorie" value={editProduct.categorie} onChange={handleEditChange} required />
                  <input type="number" name="stock" value={editProduct.stock} onChange={handleEditChange} required />
                  <input type="text" name="tailles" value={editProduct.tailles} onChange={handleEditChange} />
                  <input type="text" name="imageUrl" value={editProduct.imageUrl} onChange={handleEditChange} required />
                  <input type="text" name="videoUrl" value={editProduct.videoUrl} onChange={handleEditChange} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Annuler
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;
