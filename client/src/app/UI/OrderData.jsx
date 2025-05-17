/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Nodata from "../../assets/Nodata.svg";
import CommonPagination from "../../utils/CommonPagination";
import CommonLoading from "../../utils/CommonLoading";
import { FaEdit } from "react-icons/fa";
import moment from "moment";

const OrderData = () => {
  const [paymentData, setpaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPayment, setNewPayment] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setOrderStatus(selectedItem.orderStatus);
    }
  }, [selectedItem]);

  const fetchOrderData = async (page, limit, query = "") => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/sales/getOrderData?page=${page}&limit=${limit}&${
          query ? `search=${query}` : ""
        }`
      );
      setpaymentData(response?.data?.data);
      setTotalPages(response?.data?.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchOrderData(1, itemsPerPage,searchQuery);
  }, []);

  useEffect(() => {
    fetchOrderData(currentPage, itemsPerPage,searchQuery);
  }, [currentPage, itemsPerPage, searchQuery]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleSearch = () => {
      setCurrentPage(1);
      fetchOrderData(1, itemsPerPage, searchQuery);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setCurrentPage(1);
      fetchOrderData(1, itemsPerPage,searchQuery);
    }
  };

  const handleOrderUpdate = async () => {
    const newErrors = {};

    if (!newPayment.trim()) {
      newErrors.payment = "New payment amount is required";
    } else {
      const newPaymentValue = parseFloat(newPayment);
      const currentPaidValue = parseFloat(selectedItem?.PAID_VALUE) || 0;
      const orderValue = parseFloat(selectedItem?.VALUE) || 0;

      if (newPaymentValue < 0) {
        newErrors.payment = "Invalid amount.";
      } else if (newPaymentValue + currentPaidValue > orderValue) {
        newErrors.payment = "Invalid amount.";
      }
    }

    // Prepare structured order update data
    const orderUpdate = selectedItem?.orderData
      ?.filter(product => product.addedQuantity > 0)
      ?.map(product => ({
        productCode: product.productCode,
        addedQuantity: product.addedQuantity
      })) || [];

    // Log structured order data
    
    const data = {
      orderStatus,
      orderId: selectedItem.orderId,
      orderUpdate
    };

    console.log("Order Update Data:", data);
    try {
      const response = await axios.post("/api/sales/updateOrderData", data);
      toast.success(response?.data?.message || "Order updated successfully!");
      setIsModalOpen(false);
      setSelectedItem(null);
      setNewPayment("");
      fetchOrderData(currentPage, itemsPerPage,searchQuery);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          "Something went wrong, please try again!"
      );
    }
  };

  return (
    <>
      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Payment Details</h2>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleSearch}
              ref={searchInputRef}
              className="border border-gray-300 rounded-lg px-3 py-1 mr-2"
              style={{ outline: "none" }}
            />
          </div>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
            style={{ zIndex: 9998 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[200px] relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                  <CommonLoading />
                </div>
              )}
              <h2 className="text-lg font-semibold mb-4">Update Order</h2>
              <div className="mb-4">
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full border rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2">Product Code</th>
                        <th className="border px-4 py-2">Product Name</th>
                        <th className="border px-4 py-2">Quantity</th>
                        <th className="border px-4 py-2">Completed Quantity</th>
                        <th className="border px-4 py-2">Added Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem?.orderData?.map((product, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2 text-center">{product.productCode}</td>
                          <td className="border px-4 py-2 text-center">{product.productName}</td>
                          <td className="border px-4 py-2 text-center">{product.quantity}</td>
                          <td className="border px-4 py-2 text-center">{product.completedQuantity ?? 0}</td>
                          <td className="border px-4 py-2 text-center">
                            <input
                              type="number"
                              className="border rounded px-2 py-1 w-20 text-center outline-none"
                              min="0"
                              max={product.quantity - product.completedQuantity}
                              disabled={product.quantity === product.completedQuantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                const maxAllowed = product.quantity - product.completedQuantity;
                                if (value < 0) e.target.value = 0;
                                if (value > maxAllowed) e.target.value = maxAllowed;
                                product.addedQuantity = parseInt(e.target.value) || 0;
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-12 flex justify-start items-center mb-2">
                <label className="col-2 block text-sm font-medium text-gray-700">
                  Order Status
                </label>
                <select
                  className="col-4 mt-1 block w-full border rounded-lg px-3 py-2"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  style={{
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    outline: "none",
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="complete">Complete</option>
                </select>
              </div>
              <div className="flex justify-end space-x-6">
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg flex items-center"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
                  onClick={handleOrderUpdate}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card-body overflow-x-auto">
          <div className="min-w-full">
            <table
              id="stock-table"
              className="w-full text-sm"
            >
              <thead className="bg-slate-400">
                <tr className="pl-2 text-center">
                  <th className="border py-2 min-w-[250px]">Order Id</th>
                  <th className="border py-2 min-w-[270px]">Order Date</th>
                  <th className="border py-2 min-w-[250px]">Order Value</th>
                  <th className="border py-2 min-w-[250px]">Order Status</th>
                  <th className="border py-2 min-w-[250px]">Payment Status</th>
                  <th className="border py-2 min-w-[150px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentData?.length > 0 ? (
                  paymentData?.map((item, index) => (
                    <tr key={item.RECEIVED_ID || index} className="text-center">
                      <td className="border py-2">{item.orderId}</td>
                      <td className="border py-3">
                        {moment(item.createdDate).format("YYYY-MM-DD")}
                      </td>
                      <td className="border py-2">Rs. {item.value}</td>
                      <td className="border py-2">{item.orderStatus}</td>
                      <td className="border py-2">{item.paymentStatus}</td>
                      <td className="border py-2">
                        <button
                          className={`border-none text-slate-500 ${
                            item.orderStatus === "complete"
                              ? "cursor-not-allowed"
                              : "hover:text-slate-800"
                          }`}
                          disabled={item.orderStatus === "complete"}
                          onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <img
                        src={Nodata}
                        alt="No data"
                        className="w-32 h-52 mx-auto"
                      />
                      <p className="text-lg text-gray-500">No data found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <CommonPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      {isLoading && <CommonLoading style={{ zIndex: 10000 }} />}
    </>
  );
};

export default OrderData;
