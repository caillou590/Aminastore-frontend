// src/admin/pages/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import { ORDERS } from "../../config/api"; // <-- import de l'URL

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(ORDERS);
      setOrders(res.data.orders || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="container p-4">
        <h2>Gestion des Commandes</h2>
        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Client</th>
                <th>Produits</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.clientName}</td>
                  <td>{order.products.map(p => p.nom).join(", ")}</td>
                  <td>{order.total} FCFA</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
