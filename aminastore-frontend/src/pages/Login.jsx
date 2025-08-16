import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", motdepasse: "" });
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/clients/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("storage"));
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="container py-5" style={{maxWidth:420}}>
      <h3 className="mb-3">Connexion client</h3>
      <form onSubmit={submit} className="d-grid gap-3">
        <input type="email" className="form-control" placeholder="Email" required value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input type="password" className="form-control" placeholder="Mot de passe" required value={form.motdepasse} onChange={e=>setForm({...form, motdepasse:e.target.value})}/>
        <button className="btn btn-primary">Se connecter</button>
        {err && <div className="alert alert-danger mb-0">{err}</div>}
      </form>
    </div>
  );
}
