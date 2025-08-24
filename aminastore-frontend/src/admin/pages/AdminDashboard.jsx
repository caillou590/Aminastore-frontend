import React, { useState, useEffect } from "react";
import axios from "axios";
import AddProduct from "../components/AddProduct";
import AdminSidebar from "../components/AdminSidebar";
import "../../admin/admin.css";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement des produits");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductAdded = (product) => {
    if (editingProduct) {
      setProducts(products.map(p => p._id === product._id ? product : p));
      setEditingProduct(null);
    } else {
      setProducts([product, ...products]);
    }
  };

  const handleEdit = (product) => setEditingProduct(product);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <main className="flex-fill p-2 bg-light">
        <AddProduct
          onProductAdded={handleProductAdded}
          editingProduct={editingProduct}
          onCancel={() => setEditingProduct(null)}
        />

        <h3 className="mt-4">Liste des produits</h3>
        {loadingProducts ? (
          <p>Chargement des produits...</p>
        ) : (
          <div className="row">
            {products.length === 0 && <p>Aucun produit disponible</p>}
            {products.map(product => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product._id}>
                <div className="card h-100 shadow-sm">
                  {product.imageUrl && (
                    <img
                      src={`http://localhost:5000${product.imageUrl}`}
                      alt={product.nom}
                      className="card-img-top img-fluid"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    />
                  )}
                  {product.videoUrl && (
                    <video
                      controls
                      className="w-100 mt-2"
                      style={{ maxHeight: "250px", objectFit: "cover" }}
                    >
                      <source src={`http://localhost:5000${product.videoUrl}`} type="video/mp4" />
                      Votre navigateur ne supporte pas la vidéo.
                    </video>
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{product.nom}</h5>
                    <p className="card-text">{product.description}</p>
                    <p className="mb-1"><strong>Prix:</strong> {product.prix?.toLocaleString()} FCFA</p>
                    <p className="mb-1"><strong>Stock:</strong> {product.stock}</p>
                    <p className="mb-1"><strong>Catégorie:</strong> {product.categorie}</p>
                    {product.tailles && typeof product.tailles === "string" && (
                      <p className="mb-2"><strong>Tailles:</strong> {product.tailles.split(",").join(" | ")}</p>
                    )}
                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-sm btn-warning" onClick={() => handleEdit(product)}>Modifier</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>Supprimer</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
