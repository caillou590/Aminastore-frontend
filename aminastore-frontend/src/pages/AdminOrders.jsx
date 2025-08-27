import { useEffect, useState } from "react";
import api from "../api";

const STATUTS = ["tous", "en attente", "validé", "en préparation", "en cours de livraison", "livré", "annulé"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("tous");

  const load = async () => {
    try {
      const params = { page, limit };
      if (filterStatus !== "tous") params.statut = filterStatus;

      const res = await api.get("/orders", { params });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      setErr(e.response?.data?.message || "Accès refusé (admin requis).");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur mise à jour statut");
    }
  };

  useEffect(() => { load(); }, [page, filterStatus]);

  const prevPage = () => setPage(p => Math.max(p - 1, 1));
  const nextPage = () => setPage(p => Math.min(p + 1, totalPages));

  return (
    <div className="container py-5">
      <h3 className="mb-3">Admin — Commandes</h3>
      {err && <div className="alert alert-danger">{err}</div>}

      <div className="mb-3">
        <label className="form-label me-2">Filtrer par statut :</label>
        <select className="form-select w-auto d-inline" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Produits</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Créée</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o, idx) => (
              <tr key={o._id}>
                <td>{(page - 1) * limit + idx + 1}</td>
                <td>{o.customerName}</td>
                <td>{o.customerPhone}</td>
                <td>
                  <ul className="mb-0">
                    {o.products.map(p => (
                      <li key={p.productId._id}>
                        {p.productId.nom} x {p.quantity} ({p.productId.prix} F)
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{o.total} F</td>
                <td>
                  <span className={`badge ${o.status === "validé" ? "bg-success" :
                                           o.status === "annulé" ? "bg-danger" :
                                           "bg-secondary"}`}>
                    {o.status}
                  </span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    defaultValue={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    {STATUTS.filter(s => s !== "tous").map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length && (
              <tr>
                <td colSpan={8} className="text-center text-muted">Aucune commande</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-sm btn-secondary" onClick={prevPage} disabled={page === 1}>Précédent</button>
        <span>Page {page} / {totalPages}</span>
        <button className="btn btn-sm btn-secondary" onClick={nextPage} disabled={page === totalPages}>Suivant</button>
      </div>

      <div className="small text-muted mt-2">
        💡 En passant à “validé”, le backend décrémente automatiquement le stock.
      </div>
    </div>
  );
}
