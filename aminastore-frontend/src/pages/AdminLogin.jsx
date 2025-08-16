import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLogin() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", motdepasse: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      // adapte l’URL selon tes routes admin (ex: /admins/login ou /admin/login)
      const res = await api.post("/admins/login", form);
      // backend renvoie normalement { _id, nom, email, role, token }
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("storage"));
      nav("/admin/orders");
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur de connexion admin");
    }
  };

  return (
    <div className="container py-5" style={{maxWidth:420}}>
      <h3 className="mb-3">Connexion Admin</h3>
      <form onSubmit={submit} className="d-grid gap-3">
        <input type="email" className="form-control" placeholder="Email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input type="password" className="form-control" placeholder="Mot de passe" required value={form.motdepasse} onChange={e=>setForm({...form, motdepasse:e.target.value})}/>
        <button className="btn btn-dark">Se connecter</button>
        {err && <div className="alert alert-danger mb-0">{err}</div>}
      </form>
    </div>
  );
}
