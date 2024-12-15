import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaRegFrown } from "react-icons/fa";

const Masterdata = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const itemsPerPage = 5;

  const handleTabClick = (num) => {
    setActiveTab(num);
  };
  const handlePageChange = (page) => setCurrentPage(page);
  const handleModalToggle = () => setIsModalOpen(!isModalOpen);
  useEffect(() => {
    const tabname =
      activeTab === 1 ? "payment" : activeTab === 2 ? "order" : "stock";

    axios
      .get(`/api/masterdata/get/${tabname}`)
      .then((res) => setCurrentData(res.data));
  }, [activeTab]);
  // const data = Array(20)
  //   .fill(null)
  //   .map((_, index) => ({
  //     code: `Code-${index + 1}`,
  //     name: `Name-${index + 1}`,
  //     description: `description-${index + 1}`,
  //     status: "Active",
  //   }));

  // const startIndex = (currentPage - 1) * itemsPerPage;
  //const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  // const totalPages = Math.ceil(data.length / itemsPerPage);

  const initialvalues = {
    tag: "",
    description: "",
    status: 1,
  };
  const validationSchema = Yup.object().shape({
    tag: Yup.string().required("Required").max(10, "Tag is too long"),
    description: Yup.string()
      .required("Required")
      .max(40, "Description too long"),
  });
  const [formValues, setFormValues] = useState(initialvalues);

  const handleEdit = (rowData) => {
    handleModalToggle();
    setIsEditing(true);
    setFormValues({
      tag:
        activeTab === 1
          ? rowData.PAYMENT_TAG
          : activeTab === 2
          ? rowData.ORDER_TYPE_TAG
          : rowData.STOCK_STAGE_TAG,
      description: rowData.DESCRIPTION || "",
      status: rowData.STATUS === 1 ? "1" : "0",
    });
  };
  const onSubmit = async (values, { resetForm, setErrors }) => {
    try {
      // Send the POST request
      const tabname =
        activeTab === 1 ? "payment" : activeTab === 2 ? "order" : "stock";
      if (isEditing) {
        await axios.put(`/api/masterdata/update/${tabname}`, {
          tag: values.tag,
          description: values.description,
          status: values.status === "1" ? 1 : 0,
        });
      } else {
        await axios.post(`/api/masterdata/add/${tabname}`, {
          tag: values.tag,
          description: values.description,
          status: values.status === "1" ? 1 : 0,
        });
      }
      setIsEditing(false);
      setFormValues(initialvalues);
      handleModalToggle();
      await axios
        .get(`/api/masterdata/get/${tabname}`)
        .then((res) => setCurrentData(res.data));

      toast.success(response.data.message || "Master data added successfully!");
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);

      setErrors({});

      toast.error("Failed to send message. Please try again.");
    }
  };
  return (
    <>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <ul className="flex space-x-4">
            {["Payment", "Order", "Stock"].map((tabName, index) => (
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
        <div className=" flex-grow p-4 flex flex-col h-full">
          <div className="card-body">
            <table className="border text-sm table-fixed w-full">
              <thead className="bg-slate-400">
                <tr className="pl-2">
                  <th className="border py-2 min-w-[200px]">Tag</th>
                  <th className="border py-2 min-w-[200px]">Description</th>
                  <th className="border py-2 min-w-[200px]">Status</th>
                  <th className="border py-2 min-w-[200px]">
                    <div className="flex justify-center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <span className="text-gray-500">
                        <FaRegFrown className="inline mr-2" />
                        No Data Available
                      </span>
                    </td>
                  </tr>
                ) : (
                  currentData.map((row, index) => (
                    <tr key={index}>
                      <td className="border px-6 py-2">
                        {activeTab === 1
                          ? row.PAYMENT_TAG
                          : activeTab === 2
                          ? row.ORDER_TYPE_TAG
                          : row.STOCK_STAGE_TAG}
                      </td>
                      <td className="border px-6 py-2">{row.DESCRIPTION}</td>
                      {row.STATUS === 1 ? (
                        <td className="border px-6 py-2">
                          <span className="text-green-600">Active</span>
                        </td>
                      ) : (
                        <td className="border px-6 py-2">
                          <span className="text-red-600">Inactive</span>
                        </td>
                      )}

                      <td className="border px-6 py-2 flex justify-center items-center">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEdit(row)}
                        >
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center items-center space-x-2">
            {/* {Array.from({ length: totalPages }, (_, index) => (
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
            ))} */}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/4 p-6">
            <h2 className="text-lg font-bold mb-4">Add New Item</h2>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-1/4 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">
                    Add{" "}
                    {activeTab === 1
                      ? "Payment"
                      : activeTab === 2
                      ? "Order"
                      : "Stock"}
                  </h2>
                  <button
                    className="text-main hover:text-main"
                    onClick={() => {
                      handleModalToggle();
                      setFormValues(initialvalues);
                    }}
                  >
                    ✖
                  </button>
                </div>

                <Formik
                  enableReinitialize
                  initialValues={formValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({
                    getFieldProps,
                    touched,
                    errors,
                    handleSubmit,
                    setFieldValue,
                    values,
                    handleChange,
                  }) => (
                    <Form>
                      <div className="flex divide-x divide-gray-200">
                        <div>
                          <div>
                            <input
                              type="text"
                              name="tag"
                              {...getFieldProps("tag")}
                              className="w-32 border rounded px-3 py-2 mb-3"
                              placeholder="Tag"
                              value={values.tag}
                              onChange={(e) =>
                                setFieldValue("tag", e.target.value)
                              }
                              disabled={isEditing}
                            />

                            {touched.tag && errors.tag && (
                              <div className="text-red-500 text-sm mb-1 pl-3">
                                {errors.tag}
                              </div>
                            )}
                          </div>
                          <div>
                            <textarea
                              name="description"
                              {...getFieldProps("description")}
                              className="w-72 h-20 border rounded px-3 py-2 mb-4"
                              placeholder="Description"
                              rows={4}
                              value={values.description}
                              onChange={(e) =>
                                setFieldValue("description", e.target.value)
                              }
                              disabled={isEditing}
                            ></textarea>
                            {touched.description && errors.description && (
                              <div className="text-red-500 text-sm mb-1 pl-3">
                                {errors.description}
                              </div>
                            )}
                          </div>

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
                                  value="1"
                                  checked={values.status === "1"}
                                  onChange={() => setFieldValue("status", "1")}
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
                                  value="0"
                                  checked={values.status === "0"}
                                  onChange={() => setFieldValue("status", "0")}
                                  className="mr-2"
                                />
                                <label htmlFor="inactive" className="text-sm">
                                  Inactive
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="flex  ">
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                              onClick={() => {
                                handleModalToggle();
                                setFormValues(initialvalues);
                              }}
                            >
                              Cancel
                            </button>

                            <button
                              type="submit"
                              className="px-4 py-2 ml-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                              onClick={handleSubmit}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Masterdata;
