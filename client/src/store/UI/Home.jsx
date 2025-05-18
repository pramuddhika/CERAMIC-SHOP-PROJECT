import axios from "axios";
import { useState, useEffect } from "react";
import StorePagination from "./StorePagination";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("User"));

  useEffect(() => {
    const fetchProducts = async (page, limit) => {
      try {
        const response = await axios.get(
          `/api/productdata/get/shop/product?page=${page}&limit=${limit}`
        );
        setProducts(response.data.data);
        setTotalPages(response?.data?.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handleProductClick = (product) => {
    navigate("/ceramic/product", { state: { product } });
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.PRODUCT_CODE}
            className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onClick={() => handleProductClick(product)}
          >
            {product.QUANTITY === 0 && currentUser?.role === 'customer' && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                Sold Out
              </div>
            )}
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
      <StorePagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
};

export default Home;
