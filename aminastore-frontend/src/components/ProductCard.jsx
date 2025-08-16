import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="card h-100 shadow-sm">
      <img src={product.imageUrl || "https://via.placeholder.com/600x600"} className="card-img-top" alt={product.nom} style={{objectFit:"cover", height:240}} />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.nom}</h6>
        <p className="text-muted mb-2">{product.categorie}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>{product.prix} F</strong>
          <div>
            <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-secondary me-2">Voir</Link>
            <button className="btn btn-sm btn-primary" onClick={() => onAdd(product)}>Ajouter</button>
          </div>
        </div>
      </div>
    </div>
  );
}
