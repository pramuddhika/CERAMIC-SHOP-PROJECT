/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Nodata from "../../assets/Nodata.svg";
import CommonPagination from "../../utils/CommonPagination";
import CommonLoading from "../../utils/CommonLoading";
import { FaEdit } from "react-icons/fa";

const contactUs = () => {
  const [receivedData, setReceivedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [replyText, setReplyText] = useState("");

  const fetchContactUsData = async (page, limit) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/contactus/get?page=${page}&limit=${limit}`
      );
      setReceivedData(response?.data?.data);
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
    fetchContactUsData(1, itemsPerPage)
  }, []);

  useEffect(() => {
    fetchContactUsData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleReplySubmit =async () => {
    if (!replyText.trim()) {
      toast.error("Reply message is required");
      return;
    }
    const data = {
      id: selectedItem?.ID,
      email: selectedItem?.EMAIL,
      reply: replyText,
    };
    try {
      setIsLoading(true);
      const response = await axios.post("/api/contactus/sendReply", data);
      toast.success(response?.data?.message);
      setIsModalOpen(false);
      setSelectedItem(null);
      setReplyText("");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong, please try again!");
    } finally {
      setIsLoading(false);
      fetchContactUsData(currentPage, itemsPerPage);
    }
  };

  return (
    <>
      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Emails from Customers</h2>
          </div>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
            style={{ zIndex: 9998 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[400px] relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                  <CommonLoading />
                </div>
              )}
              <h2 className="text-lg font-semibold mb-4">Reply to Email</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border rounded-lg px-3 py-2 min-w-full"
                  value={selectedItem?.EMAIL || ""}
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
                  Reply Message
                </label>
                <textarea
                  className="mt-1 block w-full border rounded-lg px-3 py-2 min-w-full"
                  rows="4"
                  maxLength="200"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  required
                  style={{
                    boxShadow: "none",
                    borderColor: "#ced4da",
                    outline: "none",
                  }}
                />
                <div className="text-sm text-gray-500 mt-1">
                  {replyText.length}/200 characters
                </div>
              </div>
              <div className="flex justify-end space-x-6">
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg flex items-center"
                  onClick={() => {
                    setIsModalOpen(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
                  onClick={handleReplySubmit}
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
                <th className="border py-2 min-w-[200px]">Name</th>
                <th className="border py-2 min-w-[200px]">Email</th>
                <th className="border py-2 min-w-[480px]">Message</th>
                <th className="border py-2 min-w-[480px]">Reply</th>
                <th className="border py-2 min-w-[80px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {receivedData?.length > 0 ? (
                receivedData?.map((item, index) => (
                  <tr key={item.RECEIVED_ID || index} className="text-center">
                    <td className="border py-2">{item.FULL_NAME}</td>
                    <td className="border py-2">{item.EMAIL}</td>
                    <td className="border py-3">Rs. {item.MESSAGE}</td>

                    <td className="border py-2">
                      {item.Reply_MESSAGE ? (
                        <span className="">{item.Reply_MESSAGE}</span>
                      ) : (
                        <span className="text-red-500">Not replied</span>
                      )}
                    </td>
                    <td className="border py-2">
                      <button
                        className="border-none text-slate-500 hover:text-slate-800"
                        disabled={item.Reply_MESSAGE}
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
        <CommonPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
      {isLoading && <CommonLoading style={{ zIndex: 10000 }}/>}
    </>
  );
};

export default contactUs;
