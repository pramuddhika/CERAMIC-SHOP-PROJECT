import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect } from "react";
import axios from "axios";
import Nodata from "../../../assets/Nodata.svg";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CommonLoading from "../../../utils/CommonLoading";
import { toast } from "react-toastify";
import CommonPagination from "../../../utils/CommonPagination";

const Material = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [newId, setNewId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialvalues, setInitialValues] = useState({
    code: '',
    name: "",
    description: "",
    status: "1",
  })

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleModalToggle = async () => {
    if (!isModalOpen) {
      if (!isEditing) {
        await fetchMaterialId();
        setInitialValues({
          code: newId,
          name: "",
          description: "",
          status: "1",
        });
      }
    } else {
      setInitialValues({
        code: "",
        name: "",
        description: "",
        status: "1",
      });
      setIsEditing(false);
    }
    setIsModalOpen(!isModalOpen);
  };

  const fetchMasterData = async (page, limit) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/materialdata/get?page=${page}&limit=${limit}`);
      setCurrentData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const fetchMaterialId = async () => {
    try {
      const response = await axios.get(`/api/materialdata/get/ID`);
      setNewId(response?.data?.newid);
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);
    }
  };

  const handleEdit = (row) => {
    setIsEditing(true);
    setInitialValues({
      code: row.MATERIAL_ID,
      name: row.NAME,
      description: row.DESCRIPTION,
      status: row.STATUS === 1 ? "1" : "0",
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchMasterData(currentPage, itemsPerPage);
    fetchMaterialId();
  }, [currentPage, itemsPerPage]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required").max(20, "Name is too long"),
    description: Yup.string()
      .required("Required")
      .max(100, "Description too long"),
  });

  return (
    <>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Material Management</h2>
          </div>
          <button
            className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
            onClick={handleModalToggle}
          >
            <AiOutlinePlus className="mr-1" />
            Add New
          </button>
        </div>

        <div className="card-body overflow-auto flex justify-center">
          <table className="border text-sm table-fixed w-full overflow-auto">
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[200px]">ID</th>
                <th className="border py-2 min-w-[300px]">Material Name</th>
                <th className="border py-2 min-w-[540px]">Description</th>
                <th className="border py-2 min-w-[200px]">Status</th>
                <th className="border py-2 min-w-[200px]">
                  <div className="flex justify-center">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentData.message === "No data found!" ||
              currentData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <img
                      src={Nodata}
                      style={{
                        width: "150px",
                        margin: "0 auto",
                        padding: "20px",
                      }}
                    />
                    <span className="text-gray-500">No Data Available</span>
                  </td>
                </tr>
              ) : (
                Array.isArray(currentData) &&
                currentData.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-6 py-2 text-center">
                      {row.MATERIAL_ID}
                    </td>
                    <td className="border px-6 py-2 text-center">{row.NAME}</td>
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
        <CommonPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ width: "400px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {isEditing ? "Edit" : "Add"} Material
              </h2>
              <button
                className="text-slate-600 hover:text-main"
                onClick={() => {
                  handleModalToggle();
                  Formik.resetForm();
                  setIsEditing(false);
                }}
              >
                ✖
              </button>
            </div>

            <Formik
              enableReinitialize
              initialValues={initialvalues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                if (!isEditing) {
                  try {
                    const response = await axios.post(`/api/materialdata/add`, values);
                    fetchMaterialId();
                    toast.success(response?.data?.message);
                    setIsModalOpen(false);
                    handleModalToggle();
                    fetchMasterData(currentPage, itemsPerPage);
                  } catch (error) {
                    console.error("Failed:",error.response?.data || error.message);
                  }
                } else {
                  try {
                    const response = await axios.put(`/api/materialdata/edit`, values);
                    toast.success(response?.data?.message);
                    fetchMasterData(currentPage, itemsPerPage);
                    setIsModalOpen(false);
                    handleModalToggle();
                  } catch (error) {
                    console.error("Failed:",error.response?.data || error.message);
                  }
                }
              }}
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
                          name="code"
                          disabled
                          {...getFieldProps("code")}
                          className="border rounded px-1 py-2"
                          style={{ width: "100%" }}
                          placeholder="Material ID"
                          value={values.code}
                          onChange={(e) =>
                            setFieldValue("code", e.target.value)
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="text"
                          name="name"
                          {...getFieldProps("name")}
                          className="border rounded px-1 py-2"
                          style={{ width: "100%" }}
                          placeholder="Name"
                          value={values.name}
                          onChange={(e) =>
                            setFieldValue("name", e.target.value)
                          }
                        />
                        {touched.name && errors.name && (
                          <div className="text-red-500 text-sm mb-3">
                            {errors.name}
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
                            Formik.resetForm();
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 ml-3 bg-slate-500 text-white text-sm rounded hover:bg-slate-800"
                          onClick={handleSubmit}
                          disabled = {Formik.dirty}
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

      {isLoading && <CommonLoading />}
    </>
  );
};

export default Material;
