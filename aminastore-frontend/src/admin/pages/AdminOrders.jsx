// src/admin/pages/AdminOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../config";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Récupérer toutes les commandes ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
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
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-primary text-white p-3">
        <h1 className="h5 m-0 text-center">📦 Gestion des commandes</h1>
      </header>

      {/* Contenu */}
      <main className="p-3">
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

        {loading && <p className="text-center">Chargement...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && filteredOrders.length === 0 && <p className="text-center">Aucune commande trouvée.</p>}

        {!loading && filteredOrders.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Produits</th>
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
                    <td className="text-start">
                      <ul className="list-unstyled m-0">
                        {order.items?.map((i, index) => (
                          <li key={index}>
                            {i.product?.nom} — {i.quantity}x{" "}
                            {i.taille && (
                              <span className="badge bg-info">
                                Taille: {i.taille}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td><strong>{order.total.toLocaleString()} FCFA</strong></td>
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
      </main>
    </div>
  );
};

export default AdminOrders;
