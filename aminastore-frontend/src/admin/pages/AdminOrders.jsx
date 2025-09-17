import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../../config";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_BASE}/admin/orders/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  const deleteOrder = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?")) return;

    // Animation fade-out
    const row = document.getElementById(`order-${id}`);
    if (row) {
      row.classList.add("fade-out");
      setTimeout(() => {
        setOrders(prev => prev.filter(order => order._id !== id));
      }, 300);
    } else {
      setOrders(prev => prev.filter(order => order._id !== id));
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
      <header className="bg-primary text-white p-3 text-center">
        <h1 className="h5 m-0">📦 Gestion des commandes</h1>
      </header>

      {/* Main */}
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

        {/* Messages */}
        {loading && <p className="text-center">Chargement...</p>}
        {error && <p className="text-danger text-center">{error}</p>}
        {!loading && filteredOrders.length === 0 && (
          <p className="text-center">Aucune commande trouvée.</p>
        )}

        {/* Tableau */}
        {!loading && filteredOrders.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th className="d-none d-md-table-cell">Adresse</th>
                  <th className="d-none d-md-table-cell">Produits</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order._id} id={`order-${order._id}`}>
                    <td>{order.customerName}</td>
                    <td>{order.customerPhone}</td>

                    {/* Masqué sur mobile */}
                    <td className="d-none d-md-table-cell text-wrap">
                      {order.customerAddress}
                    </td>

                    {/* Masqué sur mobile */}
                    <td className="d-none d-md-table-cell text-start text-wrap">
                      <ul className="list-unstyled m-0">
                        {order.items?.map((i, idx) => (
                          <li key={idx}>
                            {i.product?.nom} — {i.quantity}x
                            {i.taille && (
                              <span className="badge bg-info ms-2">Taille: {i.taille}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td><strong>{order.total.toLocaleString()} FCFA</strong></td>

                    {/* Statut + bouton en pile sur mobile */}
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="form-select form-select-sm mb-2"
                      >
                        <option value="en attente">En attente</option>
                        <option value="validé">Validé</option>
                        <option value="en préparation">En préparation</option>
                        <option value="en cours de livraison">En cours de livraison</option>
                        <option value="livré">Livré</option>
                        <option value="annulé">Annulé</option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="btn btn-sm btn-danger w-100"
                      >
                        🗑️ Supprimer
                      </button>
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
