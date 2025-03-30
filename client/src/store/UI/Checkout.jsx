/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaLock } from "react-icons/fa";
import { SiMastercard, SiVisa } from "react-icons/si";
import { toast } from "react-toastify";
import moment from "moment";
import { use } from "react";

const Checkout = () => {
  const location = useLocation();
  const { checkoutItems } = location.state || {};
  const currentUser = JSON.parse(localStorage.getItem("User"));
  const [isLoading, setIsLoading] = useState(true);
  const [addressTags, setAddressTags] = useState([]);
  const [paymentType, setPaymentType] = useState("Card");
  const [billingAddressTag, setbillingAddressTagTag] = useState("");
  const [shippingAddressTag, setshippingAddressTag] = useState("");
  const [billingAddressData, setBillingAddressData] = useState({});
  const [shippingAddressData, setShippingAddressData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false);
  const [orderID, setOrderID] = useState();
  const navigate = useNavigate();

  const cardPaymentSchema = Yup.object().shape({
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, "Card number must be 16 digits")
      .required("Card number is required"),
    cardName: Yup.string().required("Cardholder name is required"),
    expiryDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)")
      .required("Expiry date is required"),
    cvv: Yup.string()
      .matches(/^\d{3}$/, "CVV must be 3 digits")
      .required("CVV is required"),
  });

  const handlePayment = async () => {
    try {
      setIsModalOpen(false);
      setIsThankYouModalOpen(true);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handlePlaceOrder = () => {
    setIsThankYouModalOpen(true);
  };

  const navigateToHome = () => {
    navigate("/ceramic/home");
  };

  const calculateTotal = () => {
    return (
      checkoutItems?.reduce(
        (total, item) => total + item.PRICE * item.QUANTITY,
        0
      ) || 0
    );
  };

  const fetachAddressTag = async () => {
    const userId = currentUser.id;
    try {
      const response = await axios.get(
        `/api/shopdata/getAddressTags/${userId}`
      );
      setAddressTags(response.data);
    } catch (error) {
      console.error("Error fetching address tags:", error);
    }
  };

  const handleAddressTagChange = async (tag, type) => {
    setIsLoading(true);
    const userId = currentUser.id;
    try {
      const response = await axios.get(
        `/api/shopdata/getAddressData/${userId}/${tag}`
      );
      const addressData = response.data[0];
      if (type === "billing") {
        setBillingAddressData(addressData);
      } else if (type === "shipping") {
        setShippingAddressData(addressData);
      }
      return addressData;
    } catch (error) {
      console.error("Error fetching address data:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const getOrderID = async () => {
    try {
      const response = await axios.get("/api/shopdata/getOrderId");
      setOrderID(response?.data?.newid);
    } catch (error) {
      console.error("Error fetching order ID:", error);
    }
  };

  useEffect(() => {
    getOrderID();
    fetachAddressTag();
  }, []);

  const handleOrder = async () => {
    const orders = {
      orderID: orderID,
      userId: currentUser.id,
      date: moment().format("YYYY-MM-DD"),
      orderType: currentUser.role === "customer" ? "normal" : "whole",
      totalAmount: calculateTotal(),
      billingTag: billingAddressTag,
      shippingTag: shippingAddressTag,
    };
    const order_data = {
      userId: currentUser.id,
      orderID: orderID,
      product: checkoutItems.map((item) => ({
        productCode: item.PRODUCT_CODE,
        quantity: item.QUANTITY,
        price: item.PRICE,
      })),
    };
    const payment = {
      orderID: orderID,
      date: moment().format("YYYY-MM-DD"),
      paid:
        currentUser.role === "customer"
          ? paymentType === "Card"
            ? calculateTotal()
            : 0.00
          : calculateTotal() * 0.3,
      paymentType: paymentType,
      paymentStatus:
        currentUser.role === "customer"
          ? paymentType === "Card"
            ? "complete"
            : "pending"
          : "basic",
    };

    try {
      const response = await axios.post("/api/shopdata/addOrderData", orders);
      // console.log(response?.data?.message);
      try {
        const response = await axios.post(
          "/api/shopdata/addOrderAllData",
          order_data
        );
        // console.log(response?.data?.message);
        try {
          const response = await axios.post(
            "/api/shopdata/addOrderPayment",
            payment
          );
          // console.log(response?.data?.message);
          if (paymentType === "Card") {
            setIsModalOpen(true);
          } else {
            handlePlaceOrder();
          }
        } catch (error) {
          console.error("Error placing order:", error);
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong. Please try again.");
    }
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
              <li
                key={item.PRODUCT_CODE}
                className="flex justify-between items-center mb-2"
              >
                <div className="flex items-center">
                  <img
                    src={`http://localhost:8080/images/${item.IMAGE}`}
                    alt={item.NAME}
                    className="w-8 h-8 object-cover rounded-full mr-4 "
                  />
                  <span>
                    {item.NAME} (x{item.QUANTITY})
                  </span>
                </div>
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
          <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
          <div className="flex justify-between items-center mb-4">
            <span>Payment type</span>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg outline-none"
              value={paymentType}
              onChange={(e) => {
                setPaymentType(e.target.value);
              }}
            >
              <option value="Card">Card Payment</option>
              {currentUser.role === "customer" && (
                <option value="cod">Cash on Delivery</option>
              )}
            </select>
          </div>
          {addressTags.length > 0 && (
            <div>
              <div className="flex gap-2">
                <div className="flex col-6 justify-between items-center">
                  <span>Billing Address</span>
                  <select
                    className="min-w-[150px] p-2 border border-gray-300 rounded-lg outline-none"
                    value={billingAddressTag}
                    onChange={async (e) => {
                      setbillingAddressTagTag(e.target.value);
                      await handleAddressTagChange(e.target.value, "billing");
                    }}
                  >
                    <option value="">Select Address</option>
                    {addressTags.map((tag) => (
                      <option key={tag.ID} value={tag.TAG}>
                        {tag.TAG}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex col-6 justify-between items-center">
                  <span>Shipping Address</span>
                  <select
                    className="min-w-[150px] p-2 border border-gray-300 rounded-lg outline-none"
                    value={shippingAddressTag}
                    onChange={async (e) => {
                      setshippingAddressTag(e.target.value);
                      await handleAddressTagChange(e.target.value, "shipping");
                    }}
                  >
                    <option value="">Select Address</option>
                    {addressTags.map((tag) => (
                      <option key={tag.ID} value={tag.TAG}>
                        {tag.TAG}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex col-6 justify-between items-center">
                  {billingAddressData && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg min-w-full">
                      <div className="space-y-0">
                        <p>{billingAddressData.TELEPHONE_NUMBER}</p>
                        <p>{billingAddressData.LINE_1}</p>
                        <p>{billingAddressData.LINE_2}</p>
                        <p>{billingAddressData.CITY}</p>
                        <p>{billingAddressData.DISTRICT}</p>
                        <p>{billingAddressData.PROVINCE}</p>
                        <p>{billingAddressData.POSTAL_CODE}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex col-6 justify-between items-center">
                  {shippingAddressData && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg min-w-full">
                      <div className="space-y-0">
                        <p> {shippingAddressData.TELEPHONE_NUMBER}</p>
                        <p>{shippingAddressData.LINE_1}</p>
                        <p>{shippingAddressData.LINE_2}</p>
                        <p>{shippingAddressData.CITY}</p>
                        <p>{shippingAddressData.DISTRICT}</p>
                        <p>{shippingAddressData.PROVINCE}</p>
                        <p>{shippingAddressData.POSTAL_CODE}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {addressTags.length === 0 && (
            <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg min-w-full">
              <p className="text-gray-500">
                No address found. Please add an address.
              </p>
              <button
                className="px-4 py-2 bg-slate-700 text-white rounded-lg"
                onClick={() => navigate("/ceramic/profile")}
              >
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>
      {currentUser.role === "Whole Customer" && (
        <div className="justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg min-w-full">
          <p className="text-gray-500">
            * A 30% advance payment is required to place an order.
          </p>
          <p className="text-gray-500">
            * Once your order is ready, our agent will contact you to settle the remaining balance.
          </p>
        </div>
      )}
      <div className="flex justify-end mt-6">
        <button
          disabled={billingAddressTag === "" || shippingAddressTag === ""}
          className="min-w-full p-2 bg-slate-700 text-white font-semibold rounded-lg"
          onClick={() => {
            handleOrder();
          }}
        >
          {paymentType === "Card" ? "Pay Now" : "Place Order"}
        </button>
      </div>

      {/* Card Payment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 rounded-xl w-[550px] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <FaCreditCard className="text-slate-600" />
                  Secure Payment
                </h2>
                <div className="flex gap-2">
                  <SiVisa className="text-2xl text-slate-600" />
                  <SiMastercard className="text-2xl text-orange-500" />
                </div>
              </div>

              <Formik
                initialValues={{
                  cardNumber: "",
                  cardName: "",
                  expiryDate: "",
                  cvv: "",
                }}
                validationSchema={cardPaymentSchema}
                onSubmit={handlePayment}
              >
                {({ getFieldProps, touched, errors, values }) => (
                  <Form className="space-y-6">
                    <div className="relative h-48 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl p-6 text-white shadow-lg overflow-hidden">
                      <div className="absolute top-4 right-4">
                        <FaCreditCard className="text-3xl opacity-80" />
                      </div>
                      <div className="mt-12 font-mono text-2xl tracking-wider">
                        {values.cardNumber
                          ? values.cardNumber.match(/.{1,4}/g)?.join(" ") || ""
                          : "•••• •••• •••• ••••"}
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <div className="text-xs opacity-75">Card Holder</div>
                          <div className="font-medium tracking-wide">
                            {values.cardName || "YOUR NAME"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs opacity-75">Expires</div>
                          <div className="font-medium">
                            {values.expiryDate || "MM/YY"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-4">
                      <div className="flex justify-center items-center gap-3">
                        <div>
                          <div className=" col-3 relative">
                            <Field
                              name="cardNumber"
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                              placeholder="Card Number"
                              maxLength="16"
                            />
                            <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {touched.cardNumber && errors.cardNumber && (
                            <div className="text-red-600 text-sm mt-1">
                              {errors.cardNumber}
                            </div>
                          )}
                        </div>
                        <div>
                          <Field
                            name="cardName"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all uppercase"
                            placeholder="Cardholder Name"
                          />
                          {touched.cardName && errors.cardName && (
                            <div className="text-red-600 text-sm mt-1">
                              {errors.cardName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Field
                            name="expiryDate"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                          {touched.expiryDate && errors.expiryDate && (
                            <div className="text-red-600 text-sm mt-1">
                              {errors.expiryDate}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="relative">
                            <Field
                              name="cvv"
                              type="password"
                              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all"
                              placeholder="CVV"
                              maxLength="3"
                            />
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                          {touched.cvv && errors.cvv && (
                            <div className="text-red-600 text-sm mt-1">
                              {errors.cvv}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-medium transition-colors flex items-center gap-2"
                      >
                        <FaLock className="text-sm" />
                        Pay Securely
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thank You Modal */}
      {isThankYouModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
            <p className="mb-6">Your order has been placed successfully.</p>
            <button
              onClick={navigateToHome}
              className="px-6 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
