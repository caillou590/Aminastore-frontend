import React, { useEffect, useState } from "react";
import axios from "axios";
import { ORDERS } from "../../config/api.js";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await axios.get(ORDERS);
        setOrders(res.data?.orders || res.data || []);
      }catch(e){ console.error(e); }
    })();
  },[]);

  return (
    <div>
      <h4 className="mb-3">Commandes</h4>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead>
          <tr><th>Client</th><th>Produits</th><th>Total</th><th>Statut</th></tr>
          </thead>
          <tbody>
          {orders.map(o=>(
            <tr key={o._id}>
              <td>{o.clientName || o.client?.name || "-"}</td>
              <td>{(o.products||[]).map(p=>p.nom).join(", ")}</td>
              <td>{o.total?.toLocaleString()} FCFA</td>
              <td>{o.status || "—"}</td>
            </tr>
          ))}
          {!orders.length && <tr><td colSpan={4} className="text-center text-muted">Aucune commande</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
