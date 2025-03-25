import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-8">
      <div className="col-8">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          Shopping Cart
        </h1>
      </div>
      <div className="col-3">
        <div className="bg-white p-6 rounded-lg shadow-sm sticky mt-10">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-lg text-gray-600">
              <span>Subtotal</span>
              {/* <span>${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span> */}
            </div>
            <div className="flex justify-between text-lg text-gray-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-semibold text-2xl">
                <span>Total</span>
                {/* <span>${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span> */}
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
