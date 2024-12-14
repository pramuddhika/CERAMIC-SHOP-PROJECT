import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { useFormik } from "formik";

const MemberManagement = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;

  const handleTabClick = (num) => setActiveTab(num);
  const handlePageChange = (page) => setCurrentPage(page);
  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

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
  const [setImage] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const formik = useFormik({
    initialValues: {
      code: "",
      name: "",
      description: "",
      status: "active",
    },
    onSubmit: (values) => {
      console.log("Form Values:", values);
    },
  });
  return (
    <div>
      <div className="card rounded-lg h-full w-full">
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
          <button
            className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
            onClick={handleModalToggle}
          >
            <AiOutlinePlus className="mr-1" />
            Add New
          </button>
        </div>
        <div className="card-body overflow-auto">
          <table className="border text-sm table-fixed w-full overflow-auto">
            <thead className="bg-slate-400">
              <tr className="text-center">
                <th className="border py-2 min-w-[200px]">Code</th>
                <th className="border py-2 min-w-[200px]">Name</th>
                <th className="border py-2 min-w-[500px]">Description</th>
                <th className="border py-2 min-w-[180px]">Status</th>
                <th className="border py-2 min-w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentData.map((row, index) => (
                <tr key={index}>
                  <td className="border px-6 py-2 w-64">{row.code}</td>
                  <td className="border px-6 py-2">{row.name}</td>
                  <td className="border px-6 py-2">{row.description}</td>
                  <td className="border px-6 py-2">{row.status}</td>
                  <td className="border px-6 py-4 flex justify-center items-center">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={handleModalToggle}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="mt-3 flex justify-end items-center space-x-2 p-2">
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-2/3 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Add Details</h2>
                  <button
                    className="text-main hover:text-main"
                    onClick={() => {
                      handleModalToggle();
                      formik.resetForm();
                    }}
                  >
                    ✖
                  </button>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  <div className="flex divide-x divide-gray-200">
                    <div className="w-1/3 p-4 flex flex-col items-center">
                      <div className="mb-4">
                        <label className="block">
                          <div className="size-32 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
                            <img
                              className="object-cover w-full h-full"
                              placeholder="Upload Image"
                            />
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <button
                        className="px-4 py-2 bg-slate-500 text-white text-sm rounded hover:bg-blue-800"
                        onClick={() => console.log("Upload Image")}
                      >
                        Upload Image
                      </button>
                      <div>
                        <label className="block text-sm font-semibold mb-1 mt-4">
                          ID
                        </label>
                        <input
                        type="text"
                        name="code"
                        readOnly
                        className="w-full border rounded px-3 py-2 focus:outline-none"
                        placeholder="Code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                      />
                      </div>
                     
                    </div>

                    <div className="flex flex-col w-2/3 p-4">
                      <input
                        type="text"
                        name="name"
                        className="w-full border rounded px-3 py-2 mb-4"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />

                      <textarea
                        name="description"
                        className="w-full min-w-[300px] border rounded px-3 py-2 mb-4"
                        placeholder="Description"
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                      ></textarea>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                          Status
                        </label>
                        <div className="flex items-center space-x-4">
                          <div>
                            <input
                              type="radio"
                              id="active"
                              name="status"
                              value="active"
                              checked={formik.values.status === "active"}
                              onChange={formik.handleChange}
                              className="mr-2"
                            />
                            <label htmlFor="active" className="text-sm">
                              Active
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="inactive"
                              name="status"
                              value="inactive"
                              checked={formik.values.status === "inactive"}
                              onChange={formik.handleChange}
                              className="mr-2"
                            />
                            <label htmlFor="inactive" className="text-sm">
                              Inactive
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                          onClick={() => {
                            handleModalToggle();
                            formik.resetForm();
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-500 text-white text-sm rounded hover:bg-blue-800"
                        >
                          Submit
                        </button>
                      </div>

                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
