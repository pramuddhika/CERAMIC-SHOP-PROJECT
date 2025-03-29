import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const cartItems = [
    {
      id: 1,
      name: "Ceramic Vase",
      image: "/images/vase.jpg",
      price: 25.99,
      quantity: 2,
    },
    {
      id: 2,
      name: "Ceramic Plate",
      image: "/images/plate.jpg",
      price: 15.49,
      quantity: 1,
    },
  ];

  const handleQuantityChange = (id, newQuantity) => {
    // Logic to update quantity
    console.log(`Update item ${id} to quantity ${newQuantity}`);
  };

  const handleDeleteItem = (id) => {
    // Logic to delete item
    console.log(`Delete item ${id}`);
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
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="flex gap-8">
      <div className="col-8">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          Shopping Cart
        </h1>
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
            >
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => handleSelectItem(item.id)}
                className="m-4 w-4 h-4 border-gray-300 rounded-xl"
                style={{ cursor: "pointer" }}
              />
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item.id, parseInt(e.target.value, 10))
                }
                className="w-16 p-2 border rounded-lg text-center"
              />
              <button
                onClick={() => handleDeleteItem(item.id)}
                className='text-red-500 hover:text-red-700 transition duration-200 bg-red-200 rounded-2xl p-2 ml-1'
              >
                <i className="bi bi-trash3"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="col-3">
        <div className="bg-white p-6 rounded-lg shadow-sm sticky mt-10">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-lg text-gray-600">
              <span>Subtotal</span>
              <span>${calculateSelectedTotal()}</span>
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold text-2xl">
                <span>Total</span>
                <span>${calculateSelectedTotal()}</span>
              </div>
            </div>
          </div>
          <button
            className="min-w-full p-2 bg-violet-700 text-white font-semibold rounded-lg"
            onClick={() => navigate("/ceramic/checkout")}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
