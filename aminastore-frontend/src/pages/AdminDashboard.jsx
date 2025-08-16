import { useEffect, useState } from "react";
import api from "../api";

const STATUTS = ["en attente", "validé", "en préparation", "en cours de livraison", "livré", "annulé"];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders", { params: { limit: 20 } }); // nécessite token admin
      setOrders(res.data.orders || []);
    } catch (e) {
      setErr(e.response?.data?.message || "Accès refusé (admin requis).");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      await fetchOrders();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur lors de la mise à jour du statut");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="container py-5">
      <h3 className="mb-3">Dashboard Admin — Commandes</h3>
      {err && <div className="alert alert-danger">{err}</div>}
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Créée</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o._id}>
                <td>{idx + 1}</td>
                <td>{o.customerName}</td>
                <td>{o.customerPhone}</td>
                <td>{o.total} F</td>
                <td><span className="badge text-bg-secondary">{o.status}</span></td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <select className="form-select form-select-sm" defaultValue={o.status} onChange={(e)=>updateStatus(o._id, e.target.value)}>
                    {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr><td colSpan={7} className="text-center text-muted">Aucune commande</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="small text-muted">🔒 Cette page nécessite un token admin (login admin côté backend pour récupérer un JWT admin et le stocker dans localStorage manuellement si besoin).</div>
    </div>
  );
}
