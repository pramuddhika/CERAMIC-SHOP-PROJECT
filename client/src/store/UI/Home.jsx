import axios from "axios";
import { useState, useEffect } from "react";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "/api/productdata/get/shop/product?page=1&limit=10"
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    console.log("Product Details:", product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.PRODUCT_CODE}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => handleProductClick(product)}
          >
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={`http://localhost:8080/images/${product.IMAGE}`}
                alt={product.NAME}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                  {product.NAME}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {product.CATAGORY_NAME}
                </p>
              </div>
              <p className="text-xl font-bold text-violet-700">
                Rs.{product.PRICE.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
