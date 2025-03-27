const Checkout = () => {
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
            {/* Example items */}
            <li className="flex justify-between mb-2">
              <span>Item 1</span>
              <span>$20.00</span>
            </li>
            <li className="flex justify-between mb-2">
              <span>Item 2</span>
              <span>$15.00</span>
            </li>
          </ul>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>$35.00</span>
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
