import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("tous");
  const [stockFilter, setStockFilter] = useState("tous");
  const [maxPrice, setMaxPrice] = useState(""); // Prix max entré par l'utilisateur
  const [sizeFilter, setSizeFilter] = useState("tous");
  const [categoriesList, setCategoriesList] = useState([]);
  const [maxAvailablePrice, setMaxAvailablePrice] = useState(0); // Pour le placeholder

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🔹 Récupération produits et catégories
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

      // Calcul du prix max pour placeholder
      const maxPriceValue = Math.max(...products.map(p => p.prix));
      setMaxAvailablePrice(maxPriceValue);
    } catch (err) {
      console.error("Erreur chargement produits ou catégories :", err);
      setAllProducts([]);
      setFilteredProducts([]);
      setCategoriesList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [API_URL]);

  // 🔹 Filtrage côté frontend
  useEffect(() => {
    let filtered = [...allProducts];

    if (categorie !== "tous") filtered = filtered.filter(p => p.categorie === categorie);

    if (search.trim() !== "") {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => p.nom.toLowerCase().includes(searchLower));
    }

    if (stockFilter === "disponible") filtered = filtered.filter(p => p.stock > 0);
    else if (stockFilter === "rupture") filtered = filtered.filter(p => p.stock === 0);

    if (maxPrice.trim() !== "") {
      const priceCFA = Number(maxPrice);
      if (!isNaN(priceCFA)) filtered = filtered.filter(p => p.prix <= priceCFA);
    }

    if (sizeFilter !== "tous") filtered = filtered.filter(p => p.tailles.includes(sizeFilter));

    setFilteredProducts(filtered);
  }, [search, categorie, stockFilter, maxPrice, sizeFilter, allProducts]);

  if (loading) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Nos Produits</h2>

      {/* Barre recherche et filtres */}
      <div className="d-flex flex-wrap justify-content-center mb-4 gap-2">
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="form-control border border-secondary rounded-pill"
          style={{ maxWidth: "220px", padding: "8px 15px" }}
        />

        <select
          value={categorie}
          onChange={e => setCategorie(e.target.value)}
          className="form-select border border-secondary rounded-pill"
          style={{ maxWidth: "160px", padding: "6px 12px" }}
        >
          <option value="tous">Toutes catégories</option>
          {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value)}
          className="form-select border border-secondary rounded-pill"
          style={{ maxWidth: "160px", padding: "6px 12px" }}
        >
          <option value="tous">Tous stocks</option>
          <option value="disponible">Disponible</option>
          <option value="rupture">Rupture</option>
        </select>

        <input
          type="number"
          placeholder={`Prix max (0 - ${maxAvailablePrice} CFA)`}
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="form-control border border-secondary rounded-pill"
          style={{ maxWidth: "160px", padding: "8px 15px" }}
        />

        <select
          value={sizeFilter}
          onChange={e => setSizeFilter(e.target.value)}
          className="form-select border border-secondary rounded-pill"
          style={{ maxWidth: "140px", padding: "6px 12px" }}
        >
          <option value="tous">Toutes tailles</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      {/* Liste des produits */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
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
