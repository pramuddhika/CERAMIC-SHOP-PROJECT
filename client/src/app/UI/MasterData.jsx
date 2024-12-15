import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect } from "react";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CommonLoading from "../../utils/CommonLoading";

const Masterdata = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLaoding, setIsLoading] = useState(false);

  const handleTabClick = (num) => {
    setActiveTab(num);
  };
  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const fetchMasterData = async () => {
    setIsLoading(true);
    const tabname =
      activeTab === 1 ? "payment" : activeTab === 2 ? "order" : "stock";
    try {
      const response = await axios.get(`/api/masterdata/get/${tabname}`);
      setCurrentData(response.data);
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, [activeTab]);

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

  const onSubmit = async (values, { setErrors }) => {
    try {
      if (isEditing) {
        const tabname =
          activeTab === 1 ? "payment" : activeTab === 2 ? "order" : "stock";
        const response = await axios.put(`/api/masterdata/update/${tabname}`, {
          tag: values.tag,
          description: values.description,
          status: values.status === "1" ? 1 : 0,
        });
        toast.success(response.data.message || "Data updated successfully!");
      } else {
        const tabname =
          activeTab === 1 ? "payment" : activeTab === 2 ? "order" : "stock";
        const response = await axios.post(`/api/masterdata/add/${tabname}`, {
          tag: values.tag,
          description: values.description,
          status: values.status === "1" ? 1 : 0,
        });
        toast.success(response.data.message || "Data added successfully!");
      }
      setIsEditing(false);
      setFormValues(initialvalues);
      handleModalToggle();
      fetchMasterData();
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);
      setErrors({});
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

        <div className="card-body overflow-auto">
          <table className="border text-sm table-fixed w-full overflow-auto">
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[300px]">Tag</th>
                <th className="border py-2 min-w-[540px]">Description</th>
                <th className="border py-2 min-w-[200px]">Status</th>
                <th className="border py-2 min-w-[200px]">
                  <div className="flex justify-center">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(currentData.message === "No data found!" || currentData.length === 0) ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    <span className="text-gray-500">No Data Available</span>
                  </td>
                </tr>
              ) : (
                Array.isArray(currentData) &&
                currentData.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-6 py-2 text-center">
                      {activeTab === 1
                        ? row.PAYMENT_TAG
                        : activeTab === 2
                        ? row.ORDER_TYPE_TAG
                        : row.STOCK_STAGE_TAG}
                    </td>
                    <td className="border px-6 py-2">{row.DESCRIPTION}</td>
                    {row.STATUS === 1 ? (
                      <td className="border px-6 text-center">
                        <span className="text-white bg-green-600 py-2 px-4 rounded-2xl">
                          Active
                        </span>
                      </td>
                    ) : (
                      <td className="border px-6 py-2 text-center">
                        <span className="text-white bg-red-600 py-2  px-4 rounded-2xl">
                          Inactive
                        </span>
                      </td>
                    )}
                    <td className="border px-6 py-4 flex justify-center items-center">
                      <button
                        className="text-slate-500 hover:text-slate-800 border-none"
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
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ width: "400px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit" : "Add"}{" "}
                {activeTab === 1
                  ? "Payment"
                  : activeTab === 2
                  ? "Order"
                  : "Stock"}
              </h2>
              <button
                className="text-slate-600 hover:text-main"
                onClick={() => {
                  handleModalToggle();
                  setFormValues(initialvalues);
                  setIsEditing(false);
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
              }) => (
                <Form>
                  <div className="flex divide-x divide-gray-200">
                    <div style={{ width: "480px" }} className="pr-4">
                      <div className="mb-3">
                        <input
                          type="text"
                          name="tag"
                          {...getFieldProps("tag")}
                          className="border rounded px-1 py-2"
                          style={{ width: "100%" }}
                          placeholder="Tag"
                          value={values.tag}
                          onChange={(e) => setFieldValue("tag", e.target.value)}
                          disabled={isEditing}
                        />

                        {touched.tag && errors.tag && (
                          <div className="text-red-500 text-sm mb-3">
                            {errors.tag}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <textarea
                          name="description"
                          {...getFieldProps("description")}
                          className="w-32 border rounded px-1 py-2"
                          placeholder="Description"
                          style={{ width: "100%" }}
                          rows={4}
                          value={values.description}
                          onChange={(e) =>
                            setFieldValue("description", e.target.value)
                          }
                          disabled={isEditing}
                        ></textarea>
                        {touched.description && errors.description && (
                          <div className="text-red-500 text-sm mb-3">
                            {errors.description}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                          Status
                        </label>
                        <div className="flex items-center gap-24 space-x-4">
                          <div className="flex items-center px-2">
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
                          <div className="flex items-center px-2">
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

                      <div className="flex justify-between">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                          onClick={() => {
                            handleModalToggle();
                            setFormValues(initialvalues);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 ml-3 bg-slate-500 text-white text-sm rounded hover:bg-slate-800"
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
      )}

      {isLaoding && <CommonLoading />}
    </>
  );
};

export default Masterdata;
