import React, { useEffect, useState } from "react";
import axios from "axios";
import { CLIENTS } from "../../config/api";

const AdminUsers = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer tous les clients
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(CLIENTS, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setClients(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des clients :", err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un client
  const deleteClient = async (id) => {
    if (!window.confirm("Supprimer ce client ?")) return;
    try {
      await axios.delete(`${CLIENTS}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      alert("Client supprimé !");
      fetchClients();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  if (loading) return <p className="p-4">Chargement des clients…</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestion des Clients</h2>

      {clients.length === 0 ? (
        <p>Aucun client disponible</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              // Séparer nom et email si besoin
              const [prenom, nom] = client.nom.split(" ") || [client.nom, ""];
              return (
                <tr key={client._id}>
                  <td>{prenom} {nom}</td>
                  <td>{client.email}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteClient(client._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
