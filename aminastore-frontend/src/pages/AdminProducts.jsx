import { useEffect, useState } from "react";
import api from "../api";

export default function AdminProducts() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // produit en édition
  const [form, setForm] = useState({ nom:"", description:"", prix:"", categorie:"", stock:"", tailles:"", imageUrl:"", videoUrl:"" });
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", { params:{ limit: 100 }});
      setList(res.data.products || res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ nom:"", description:"", prix:"", categorie:"", stock:"", tailles:"", imageUrl:"", videoUrl:"" });
    setEditing(null);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        prix: Number(form.prix),
        stock: Number(form.stock),
      };
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        setMsg("Produit mis à jour ✅");
      } else {
        await api.post("/products", payload);
        setMsg("Produit créé ✅");
      }
      await load();
      resetForm();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur enregistrement");
    }
  };

  const edit = (p) => {
    setEditing(p);
    setForm({
      nom: p.nom || "",
      description: p.description || "",
      prix: p.prix || "",
      categorie: p.categorie || "",
      stock: p.stock || "",
      tailles: p.tailles || "",
      imageUrl: p.imageUrl || "",
      videoUrl: p.videoUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const del = async (p) => {
    if (!confirm(`Supprimer "${p.nom}" ?`)) return;
    try {
      await api.delete(`/products/${p._id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Erreur suppression");
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-3">Admin — Produits</h3>

      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Formulaire création/édition */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">{editing ? "Modifier le produit" : "Nouveau produit"}</h5>
          <form className="row g-3" onSubmit={save}>
            <div className="col-md-6">
              <label className="form-label">Nom</label>
              <input className="form-control" required value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})}/>
            </div>
            <div className="col-md-6">
              <label className="form-label">Catégorie</label>
              <input className="form-control" required value={form.categorie} onChange={e=>setForm({...form, categorie:e.target.value})}/>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" required rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
            </div>
            <div className="col-md-4">
              <label className="form-label">Prix (F)</label>
              <input type="number" min="0" className="form-control" required value={form.prix} onChange={e=>setForm({...form, prix:e.target.value})}/>
            </div>
            <div className="col-md-4">
              <label className="form-label">Stock</label>
              <input type="number" min="0" className="form-control" required value={form.stock} onChange={e=>setForm({...form, stock:e.target.value})}/>
            </div>
            <div className="col-md-4">
              <label className="form-label">Tailles (ex: S,M,L)</label>
              <input className="form-control" value={form.tailles} onChange={e=>setForm({...form, tailles:e.target.value})}/>
            </div>
            <div className="col-md-6">
              <label className="form-label">Image URL *</label>
              <input className="form-control" required value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})}/>
              <div className="form-text">Le backend exige `imageUrl`.</div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Vidéo URL (optionnel)</label>
              <input className="form-control" value={form.videoUrl} onChange={e=>setForm({...form, videoUrl:e.target.value})}/>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-dark">{editing ? "Mettre à jour" : "Créer"}</button>
              {editing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Annuler</button>}
            </div>
          </form>
        </div>
      </div>

      {/* Liste produits */}
      <div className="table-responsive">
        {loading ? <p>Chargement…</p> : (
          <table className="table align-middle table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Maj</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(p => (
                <tr key={p._id}>
                  <td><img src={p.imageUrl} alt={p.nom} width="60" height="60" style={{objectFit:"cover"}} className="rounded" /></td>
                  <td>{p.nom}</td>
                  <td>{p.categorie}</td>
                  <td>{p.prix} F</td>
                  <td>{p.stock}</td>
                  <td className="small text-muted">{new Date(p.updatedAt).toLocaleString()}</td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>edit(p)}>Éditer</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={()=>del(p)}>Supprimer</button>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={7} className="text-center text-muted">Aucun produit</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
