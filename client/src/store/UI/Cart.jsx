import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommonLoading from "../../utils/CommonLoading";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("User"));
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/shopdata/getCartData/${currentUser.id}`
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = (id, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) => {
        if (item.PRODUCT_CODE === id) {
          if (newQuantity > 0 && (currentUser.role === "Whole Customer" || newQuantity <= item.STOCK_QUANTITY)) {
            return { ...item, QUANTITY: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleDeleteItem = async (id) => {
    const data = {
      userId: currentUser.id,
      productCode: id,
    };
    try {
      const response = await axios.put("/api/shopdata/deleteCartData", data);
      toast.success(
        response.data.message || "Item removed from cart successfully!"
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.PRODUCT_CODE))
      .reduce((total, item) => total + item.PRICE * item.QUANTITY, 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to checkout.");
      return;
    }
    const checkoutItems = cartItems.filter((item) =>
      selectedItems.includes(item.PRODUCT_CODE)
    );
    navigate("/ceramic/checkout", { state: { checkoutItems } });
  };

  return (
    <div className="flex gap-8">
      {cartItems.length === 0 && (
        <div className="col-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">
              Add items to your cart to see them here.
            </p>
            <button
              className="min-w-full p-2 bg-slate-700 text-white font-semibold rounded-lg"
              onClick={() => navigate("/ceramic/home")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="col-8">
          <h1 className="text-4xl font-bold mb-10 text-gray-800">
            Shopping Cart
          </h1>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.PRODUCT_CODE}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.PRODUCT_CODE)}
                  onChange={() => handleSelectItem(item.PRODUCT_CODE)}
                  className="m-4 w-4 h-4 border-gray-300 rounded-xl"
                  style={{ cursor: "pointer" }}
                />
                <img
                  src={`http://localhost:8080/images/${item.IMAGE}`}
                  alt={item.NAME}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <h3 className="text-lg font-semibold">{item.NAME}</h3>
                  <p className="text-gray-600">Rs.{item.PRICE.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  value={item.QUANTITY}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.PRODUCT_CODE,
                      parseInt(e.target.value, 10)
                    )
                  }
                  className="w-16 p-2 border rounded-lg text-center outline-none"
                />
                <button
                  onClick={() => handleDeleteItem(item.PRODUCT_CODE)}
                  className="text-red-500 hover:text-red-700 transition duration-200 bg-red-200 rounded-2xl p-2 ml-1"
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {cartItems.length > 0 && (
        <div className="col-3">
          <div className="bg-white p-6 rounded-lg shadow-sm sticky mt-10">
            <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-lg text-gray-600">
                <span>Subtotal</span>
                <span>Rs.{calculateSelectedTotal()}</span>
              </div>
              <div className="flex justify-between text-lg text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-2xl">
                  <span>Total</span>
                  <span>Rs.{calculateSelectedTotal()}</span>
                </div>
              </div>
            </div>
            <button
              className="min-w-full p-2 bg-slate-700 text-white font-semibold rounded-lg"
              onClick={() => handleCheckout()}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {isLoading && <CommonLoading />}
    </div>
  );
};

export default Cart;
