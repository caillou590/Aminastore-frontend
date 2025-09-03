import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]); // tous les produits
  const [filteredProducts, setFilteredProducts] = useState([]); // produits affichés
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("tous");
  const [categoriesList, setCategoriesList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🔹 Récupérer tous les produits et catégories
  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/api/products`),
        axios.get(`${API_URL}/api/products/categories`),
      ]);
      const products = productsRes.data.products || productsRes.data;
      setAllProducts(products);
      setFilteredProducts(products);
      setCategoriesList(categoriesRes.data);
    } catch (err) {
      console.error("Erreur chargement produits ou catégories :", err);
      setAllProducts([]);
      setFilteredProducts([]);
      setCategoriesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductsAndCategories(); }, [API_URL]);

  // 🔹 Filtrage côté frontend
  useEffect(() => {
    let filtered = [...allProducts];

    if (categorie !== "tous") {
      filtered = filtered.filter(p => p.categorie === categorie);
    }

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => p.nom.toLowerCase().includes(searchLower));
    }

    setFilteredProducts(filtered);
  }, [search, categorie, allProducts]);

  if (loading) {
    return <div className="text-center mt-5">Chargement...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Nos Produits</h2>

      {/* Barre recherche et filtre */}
      <div className="d-flex justify-content-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          style={{ maxWidth: "300px" }}
        />
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="form-control"
          style={{ maxWidth: "200px" }}
        >
          <option value="tous">Toutes catégories</option>
          {categoriesList.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Liste produits */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const fullProduct = {
              ...product,
              imageUrl: product.imageUrl?.startsWith("http")
                ? product.imageUrl
                : `${API_URL}${product.imageUrl}`,
              videoUrl: product.videoUrl
                ? product.videoUrl.startsWith("http")
                  ? product.videoUrl
                  : `${API_URL}${product.videoUrl}`
                : null,
            };
            return <ProductCard key={product._id} product={fullProduct} />;
          })
        ) : (
          <p className="text-center text-muted py-5">Aucun produit disponible.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
