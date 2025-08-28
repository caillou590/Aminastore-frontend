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
      // token admin
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Vérifie que les données sont bien un tableau
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">📦 Gestion des commandes</h1>
      </header>

      {/* Contenu */}
      <main className="flex-grow p-4">
        {/* Barre de recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou adresse..."
            className="w-full md:w-1/2 p-2 border rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && filteredOrders.length === 0 && <p>Aucune commande trouvée.</p>}

        {!loading && filteredOrders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-center">
                  <th className="p-2 border">Nom</th>
                  <th className="p-2 border">Téléphone</th>
                  <th className="p-2 border">Adresse</th>
                  <th className="p-2 border">Produit(s)</th>
                  <th className="p-2 border">Quantité</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Statut</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredOrders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">{order.customerPhone}</td>
                    <td className="p-2">{order.customerAddress}</td>
                    <td className="p-2">{order.items?.map(i => i.product?.nom).join(", ")}</td>
                    <td className="p-2">{order.items?.map(i => i.quantity).join(", ")}</td>
                    <td className="p-2">{order.total} FCFA</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border rounded p-1 w-full"
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center p-4 mt-auto">
        <p>© 2025 AminaStore - Admin Dashboard</p>
      </footer>
    </div>
  );
};

export default AdminOrders;
