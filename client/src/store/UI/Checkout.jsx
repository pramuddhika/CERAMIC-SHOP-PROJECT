import { useLocation } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const { checkoutItems } = location.state || {};

  console.log("Checkout Items:", checkoutItems);

  const calculateTotal = () => {
    return checkoutItems?.reduce((total, item) => total + item.PRICE * item.QUANTITY, 0) || 0;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="col-8">
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          Order Checkout
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary Section */}
        <div className="bg-white p-6 shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <ul className="mb-4">
            {checkoutItems?.map((item) => (
              <li key={item.PRODUCT_CODE} className="flex justify-between mb-2">
                <span>{item.NAME} (x{item.QUANTITY})</span>
                <span>Rs.{(item.PRICE * item.QUANTITY).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>Rs.{calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* User Details Form */}
        <div className="bg-white p-6 shadow-md rounded">
          <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="address">
                Shipping Address
              </label>
              <textarea
                id="address"
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter your address"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Confirm Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
