import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";

const MemberManagement = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleTabClick = (num) => setActiveTab(num);

  const data = Array(20)
    .fill(null)
    .map((_, index) => ({
      code: `Code-${index + 1}`,
      name: `Name-${index + 1}`,
      description: `description-${index + 1}`,
      status: "Active",
    }));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-4 ">
      <h1 className="text-xl font-bold mb-4">Product</h1>
      <div className="card shadow-lg rounded-lg h-full w-full ">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <ul className="flex space-x-4">
            {["Category", "Subcategory", "Product"].map((tabName, index) => (
              <li key={index}>
                <button
                  className={`px-4 py-2 text-sm font-semibold ${
                    activeTab === index + 1
                      ? "text-gray-800 border-b-2 border-amber-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => handleTabClick(index + 1)}
                >
                  {tabName}
                </button>
              </li>
            ))}
          </ul>
          <button className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center">
            <AiOutlinePlus className="mr-1" />
            Add New
          </button>
        </div>
        <div className="card-body flex-grow p-4 flex flex-col">
          <div
            className="overflow-auto p-4"
            style={{
              margin: "0 auto",
              maxWidth: "1960px",
              minWidth: "1100px",
              minHeight: "400px",
            }}
          >
            <table className="table-auto border border-amber-900 w-full text-sm">
              <thead className="bg-cyan-500">
                <tr>
                  <th className="border px-6 py-2 w-1/5">Code</th>
                  <th className="border px-6 py-2 w-1/5">Name</th>
                  <th className="border px-6 py-2 w-2/5">Description</th>
                  <th className="border px-6 py-2 w-1/5">Status</th>
                  <th className="border px-6 py-2 w-1/5">
                    <div className="flex justify-center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentData.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-6 py-2">{row.code}</td>
                    <td className="border px-6 py-2">{row.name}</td>
                    <td className="border px-6 py-2">{row.description}</td>
                    <td className="border px-6 py-2">{row.status}</td>
                    <td className="border px-6 py-2 flex justify-center items-center">
                      <button className="text-blue-600 hover:text-blue-800">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center items-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-2 py-1 text-sm rounded ${
                  currentPage === index + 1
                    ? "bg-amber-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
