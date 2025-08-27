import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard.jsx";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("tous");
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Récupérer produits et catégories
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/products`);
        const allProducts = res.data?.products || res.data || [];
        setProducts(allProducts);

        // Extraire les catégories uniques
        const uniqueCategories = ["tous", ...new Set(allProducts.map(p => p.categorie))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Erreur chargement produits :", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.nom.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "tous" || p.categorie === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <p>Chargement des produits...</p>;
  if (!products.length) return <p>Aucun produit disponible</p>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Tous nos produits</h2>

      {/* Barre de recherche et filtre */}
      <div className="mb-4 d-flex justify-content-between">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control me-2"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-control"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="row">
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                imageUrl: product.imageUrl?.startsWith("http")
                  ? product.imageUrl
                  : `${API_URL}${product.imageUrl}`,
                videoUrl: product.videoUrl
                  ? product.videoUrl.startsWith("http")
                    ? product.videoUrl
                    : `${API_URL}${product.videoUrl}`
                  : null,
              }}
            />
          ))
        ) : (
          <p>Aucun produit correspondant.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
