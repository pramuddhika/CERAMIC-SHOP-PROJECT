import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Collection = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch initial category data
    axios
      .get("http://localhost:8080/api/productdata/get/categoryList")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleCardClick = (value, level) => {
    // Navigate to login if clicking on a product
    if (level === "product") {
      navigate("/login");
      return;
    }

    // Save current state to history
    setHistory((prev) => [...prev, { categories, subcategories, products }]);

    if (level === "category") {
      // Fetch subcategories
      axios
        .get(`http://localhost:8080/api/productdata/get/category/${value}`)
        .then((response) => {
          setSubcategories(response.data);
          setCategories([]);
          setProducts([]);
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
        });
    } else if (level === "subcategory") {
      // Fetch products
      axios
        .get(`http://localhost:8080/api/productdata/get/product/${value}`)
        .then((response) => {
          setProducts(response.data);
          setCategories([]);
          setSubcategories([]);
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
        });
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setCategories(lastState.categories || []);
      setSubcategories(lastState.subcategories || []);
      setProducts(lastState.products || []);
      setHistory((prev) => prev.slice(0, -1)); // Remove last item from history
    }
  };

  const renderCards = (items, level) =>
    items.map((item, index) => (
      <div
        key={index}
        className="bg-white shadow-2xl rounded-md m-8 p-4 cursor-pointer"
        onClick={() => handleCardClick(item.value, level)}
      >
        <img
          src={`http://localhost:8080/images/${item.image}`}
          alt={item.label}
          className="w-full h-60 object-fill rounded-md mx-auto p-2"
        />
        <h2 className="text-xl font-bold mt-2 text-center">{item.label}</h2>
      </div>
    ));

  return (
    <div id="collection" className="min-h-[500px] mt-16">
      <div>
        {/* Back Button and Title */}
        <div className="flex items-center justify-center mt-20 space-x-4">
          {history.length > 0 && (
            <FaChevronLeft
              className="text-main cursor-pointer text-2xl"
              onClick={handleBack}
            />
          )}
          <h1 className="text-4xl font-bold text-main">
            {products.length > 0
              ? "Products"
              : subcategories.length > 0
              ? "Subcategories"
              : "Our Collection"}
          </h1>
        </div>

        <div className="mt-10">
          <div
            className={`grid grid-cols-1 ${
              categories.length === 1 || subcategories.length === 1
                ? "md:grid-cols-1"
                : "md:grid-cols-2 lg:grid-cols-3"
            } gap-4 justify-center`}
          >
            {categories.length > 0 && renderCards(categories, "category")}
            {subcategories.length > 0 &&
              renderCards(subcategories, "subcategory")}
            {products.length > 0 && renderCards(products, "product")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
