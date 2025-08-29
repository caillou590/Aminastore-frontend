// src/admin/pages/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../config";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Récupérer toutes les commandes ---
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(response.data.orders) ? response.data.orders : []);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  // --- Mettre à jour le statut d'une commande ---
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`${API_BASE}/admin/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(prev =>
        prev.map(order => order._id === id ? { ...order, status: newStatus } : order)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    order.customerPhone?.includes(search) ||
    order.customerAddress?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-primary">📦 Gestion des commandes</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Chargement...</div>}

      {/* Barre de recherche */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Rechercher par nom, téléphone ou adresse..."
          className="form-control"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!loading && filteredOrders.length === 0 && <div className="alert alert-warning">Aucune commande trouvée.</div>}

      {!loading && filteredOrders.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-light">
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Produit(s)</th>
                <th>Quantité</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>{order.customerPhone}</td>
                  <td>{order.customerAddress}</td>
                  <td>{order.products?.map(p => p.productId?.nom || "Produit inconnu").join(", ")}</td>
                  <td>{order.products?.map(p => p.quantity).join(", ")}</td>
                  <td>{order.total.toLocaleString()} FCFA</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="form-select form-select-sm"
                    >
                      <option value="en attente">En attente</option>
                      <option value="validé">Validé</option>
                      <option value="en préparation">En préparation</option>
                      <option value="en cours de livraison">En cours de livraison</option>
                      <option value="livré">Livré</option>
                      <option value="annulé">Annulé</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
