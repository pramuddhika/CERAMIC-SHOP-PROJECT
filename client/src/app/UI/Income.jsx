/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Nodata from "../../assets/Nodata.svg";
import CommonPagination from "../../utils/CommonPagination";
import CommonLoading from "../../utils/CommonLoading";
import { FaEdit } from "react-icons/fa";
import moment from "moment";

const Income = () => {
  const [paymentData, setpaymentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newPayment, setNewPayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errors, setErrors] = useState({});
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedItem) {
      setPaymentStatus(selectedItem.PAYMENT_STATUS);
      setErrors({});
    }
  }, [selectedItem]);

  const fetchPaymentData = async (page, limit, query = "") => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/sales/getPaymentData?page=${page}&limit=${limit}&${
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
    fetchPaymentData(1, itemsPerPage);
  }, []);

  useEffect(() => {
    fetchPaymentData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchPaymentData(1, itemsPerPage, searchQuery);
    }
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setCurrentPage(1);
      fetchPaymentData(1, itemsPerPage);
    }
  };

  const handlePaymentSubmit = async () => {
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newPaymentValue = parseFloat(newPayment);
    const data = {
      orderId: selectedItem?.ORDER_ID,
      newPayment: newPaymentValue,
      paymentStatus: paymentStatus,
    };

    try {
      const response = await axios.post("/api/sales/updatePaymentData", data);
      toast.success(response?.data?.message || "Payment updated successfully!");
      setIsModalOpen(false);
      setSelectedItem(null);
      setNewPayment("");
      setPaymentStatus("");
      fetchPaymentData(currentPage, itemsPerPage);
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
              <h2 className="text-lg font-semibold mb-4">Update Payment</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Order ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-lg px-3 py-2"
                  value={selectedItem?.ORDER_ID || ""}
                  readOnly
                  style={{
                    backgroundColor: "#f3f4f6",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    outline: "none",
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Order Value
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-lg px-3 py-2"
                  value={`Rs. ${selectedItem?.VALUE || 0}`}
                  readOnly
                  style={{
                    backgroundColor: "#f3f4f6",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    outline: "none",
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Paid Value
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-lg px-3 py-2"
                  value={`Rs. ${selectedItem?.PAID_VALUE || 0}`}
                  readOnly
                  style={{
                    backgroundColor: "#f3f4f6",
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    outline: "none",
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Recevied Payment
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded-lg px-3 py-2"
                  value={newPayment}
                  onChange={(e) => setNewPayment(e.target.value)}
                  min="0"
                  required
                  style={{
                    boxShadow: "none",
                    borderColor: errors.payment ? "#dc3545" : "#ced4da",
                    outline: "none",
                  }}
                />
                {errors.payment && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.payment}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Status
                </label>
                <select
                  className="mt-1 block min-w-full border rounded-lg px-3 py-2"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  required
                  style={{
                    boxShadow: "none",
                    borderColor: errors.payment ? "#dc3545" : "#ced4da",
                    outline: "none",
                  }}
                >
                  <option value={selectedItem?.PAYMENT_STATUS}>
                    {selectedItem?.PAYMENT_STATUS}
                  </option>
                  {selectedItem?.PAYMENT_STATUS !== "complete" && (
                    <option value="complete">complete</option>
                  )}
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
                  onClick={handlePaymentSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card-body overflow-auto flex justify-center">
          <table
            id="stock-table"
            className="border text-sm table-fixed w-full overflow-auto"
          >
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[150px]">Order Id</th>
                <th className="border py-2 min-w-[150px]">Order Status</th>
                <th className="border py-2 min-w-[170px]">Order Date</th>
                <th className="border py-2 min-w-[150px]">Order Value</th>
                <th className="border py-2 min-w-[170px]">Last Payment Date</th>
                <th className="border py-2 min-w-[150px]">Paid Value</th>
                <th className="border py-2 min-w-[150px]">Payment Type</th>
                <th className="border py-2 min-w-[150px]">Payment Status</th>
                <th className="border py-2 min-w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentData?.length > 0 ? (
                paymentData?.map((item, index) => (
                  <tr key={item.RECEIVED_ID || index} className="text-center">
                    <td className="border py-2">{item.ORDER_ID}</td>
                    <td className="border py-2">{item.STATUS}</td>
                    <td className="border py-3">
                      {moment(item.DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">Rs. {item.VALUE}</td>
                    <td className="border py-3">
                      {moment(item.PAYMENT_DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">Rs. {item.PAID_VALUE}</td>
                    <td className="border py-2">{item.PATMENT_TYPE}</td>
                    <td className="border py-2">
                      <span
                        className={
                          item.PAYMENT_STATUS === "complete"
                            ? "text-green-500"
                            : ""
                        }
                      >
                        {item.PAYMENT_STATUS}
                      </span>
                    </td>
                    <td className="border py-2">
                      <button
                        className={`border-none text-slate-500 ${
                          item.PAYMENT_STATUS === "complete"
                            ? "cursor-not-allowed"
                            : "hover:text-slate-800"
                        }`}
                        disabled={item.PAYMENT_STATUS === "complete"}
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
                  <td colSpan="9" className="text-center py-4">
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

export default Income;
