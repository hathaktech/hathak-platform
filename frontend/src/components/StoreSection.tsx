"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Star, ShoppingCart, Heart, ArrowRight, Filter, Grid, List } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export default function StoreSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockCategories: Category[] = [
      { id: "electronics", name: "Electronics", image: "", productCount: 45 },
      { id: "fashion", name: "Fashion", image: "", productCount: 32 },
      { id: "home", name: "Home & Garden", image: "", productCount: 28 },
      { id: "sports", name: "Sports", image: "", productCount: 19 },
      { id: "beauty", name: "Beauty", image: "", productCount: 24 },
      { id: "books", name: "Books", image: "", productCount: 15 },
    ];

    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        originalPrice: 129.99,
        image: "",
        rating: 4.5,
        reviews: 234,
        category: "electronics",
        isOnSale: true
      },
      {
        id: "2",
        name: "Premium Cotton T-Shirt",
        price: 24.99,
        image: "",
        rating: 4.2,
        reviews: 89,
        category: "fashion",
        isNew: true
      },
      {
        id: "3",
        name: "Smart Home Speaker",
        price: 149.99,
        image: "",
        rating: 4.7,
        reviews: 156,
        category: "electronics"
      },
      {
        id: "4",
        name: "Organic Coffee Beans",
        price: 18.99,
        image: "",
        rating: 4.3,
        reviews: 67,
        category: "home"
      },
      {
        id: "5",
        name: "Yoga Mat Premium",
        price: 39.99,
        image: "",
        rating: 4.6,
        reviews: 123,
        category: "sports"
      },
      {
        id: "6",
        name: "Skincare Set",
        price: 79.99,
        image: "",
        rating: 4.4,
        reviews: 98,
        category: "beauty"
      },
    ];

    setCategories(mockCategories);
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "text-warning fill-current" : "text-neutral-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-1"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl lg:text-display-2 text-neutral-900 mb-4">
            HatHak Store
          </h2>
          <p className="text-base sm:text-body-large text-neutral-600 max-w-3xl mx-auto">
            Discover amazing products from our curated collection. 
            Quality guaranteed with fast delivery and excellent customer service.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-12 px-4">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-body font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-primary-1 text-white shadow-elegant"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-body font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary-1 text-white shadow-elegant"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <span className="hidden sm:inline">{category.name} ({category.productCount})</span>
                <span className="sm:hidden">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 px-4 gap-4">
          <div className="flex items-center space-x-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
            <span className="text-sm sm:text-body text-neutral-600">
              {filteredProducts.length} products found
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid" ? "bg-primary-1 text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list" ? "bg-primary-1 text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              <List className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 sm:gap-6 px-4 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`group bg-white rounded-2xl shadow-elegant hover:shadow-panel transition-all duration-300 border border-neutral-200 hover:border-primary-1 ${
                viewMode === "list" ? "flex p-6" : "p-6"
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${viewMode === "list" ? "w-32 h-32 mr-6" : "aspect-square mb-4"}`}>
                <div className="w-full h-full bg-neutral-100 rounded-xl flex items-center justify-center">
                  <div className="w-16 h-16 bg-neutral-200 rounded-lg flex items-center justify-center">
                    <span className="text-neutral-400 text-sm font-medium">No Image</span>
                  </div>
                </div>
                {product.isNew && (
                  <div className="absolute top-2 left-2 bg-success text-white px-2 py-1 rounded-lg text-caption font-medium">
                    New
                  </div>
                )}
                {product.isOnSale && (
                  <div className="absolute top-2 right-2 bg-accent-default text-white px-2 py-1 rounded-lg text-caption font-medium">
                    Sale
                  </div>
                )}
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-elegant opacity-0 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-4 h-4 text-neutral-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className={`flex-1 ${viewMode === "list" ? "flex flex-col justify-between" : ""}`}>
                <div>
                  <h3 className="text-heading-3 text-neutral-900 mb-2 group-hover:text-primary-1 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-body-small text-neutral-600">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-heading-2 text-neutral-900 font-semibold">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-body text-neutral-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex items-center space-x-2 ${viewMode === "list" ? "mt-4" : ""}`}>
                  <button className="flex-1 bg-primary-1 text-white py-3 px-4 rounded-xl hover:bg-primary-2 transition-colors flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="font-medium">Add to Cart</span>
                  </button>
                  <Link
                    href={`/HatHakStore/${product.id}`}
                    className="p-3 border border-neutral-300 rounded-xl hover:border-primary-1 hover:bg-neutral-50 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 text-neutral-600" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12 px-4">
          <Link
            href="/HatHakStore"
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-primary-1 text-white rounded-xl hover:bg-primary-2 transition-colors shadow-elegant"
          >
            <span className="font-medium text-sm sm:text-body">View All Products</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
