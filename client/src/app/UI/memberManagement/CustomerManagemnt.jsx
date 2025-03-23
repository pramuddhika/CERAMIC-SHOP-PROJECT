import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import Nodata from "../../../assets/Nodata.svg";
import CommonPagination from "../../../utils/CommonPagination";
import CommonLoading from "../../../utils/CommonLoading";

const CustomerManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [supplierList, setSupplierList] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  const handleModalToggle = async (isEdit = false) => {
    if (!isModalOpen) {
      setIsEditing(isEdit);
      if (!isEdit) {
        await UserId();
      }
    } else {
      setSelectedSupplier(null);
      setIsEditing(false);
    }
    setIsModalOpen(!isModalOpen);
  };

  const SuplierValidationSchema = Yup.object().shape({
    firstName: Yup.string().max(20, "too long").required("Required"),
    lastName: Yup.string().max(20, "too long").required("Required"),
    email: Yup.string()
      .max(50, "too long")
      .email("Invalid email")
      .required("Required"),
    status: Yup.string().required("Required"),
    userType: Yup.string().required("Required"), 
  });

  const initValues = {
    firstName: "",
    lastName: "",
    email: "",
    status: "1",
    userType: "", 
  };

  const UserId = async () => {
    try {
      const response = await axios.get("/api/auth/generateUserId");
      setUserId(response.data.newid);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCustomerData = async (page, limit, query = "") => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/auth/getCustomerData?page=${page}&limit=${limit}&${
          query ? `search=${query}` : ""
        }`
      );
      setSupplierList(response?.data?.data);
      setTotalPages(response?.data?.totalPages);
      UserId();
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    UserId();
    fetchCustomerData(currentPage, itemsPerPage, searchQuery);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      fetchCustomerData(currentPage, itemsPerPage);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const data = {
      ...values,
      userId: isEditing && selectedSupplier ? selectedSupplier.USER_ID : userId,
      status: parseInt(values.status),
    };
    try {
      if (isEditing && selectedSupplier) {
        const response = await axios.post("/api/auth/editMemberData", data);
        toast.success(response.data.message);
        setUserId(null);
        handleModalToggle();
        resetForm();
      } else {
        const response = await axios.post("/api/auth/createMember", data);
        setUserId(null);
        toast.success(response.data.message);
        resetForm();
        handleModalToggle();
      }
      fetchCustomerData(currentPage, itemsPerPage);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchCustomerData(1, itemsPerPage, searchQuery);
    }
  };

  return (
    <>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Customer Management</h2>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleSearch}
              ref={searchInputRef}
              className="border border-gray-300 rounded-lg px-3 py-1 mr-2"
              style={{ outline: "none" }}
            />
            <button
              className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 gap-2 rounded-lg flex items-center"
              onClick={handleModalToggle}
            >
              <i className="bi bi-person-plus"></i>
              Add New
            </button>
          </div>
        </div>

        <div className="card-body overflow-auto flex justify-center">
          <table className="border text-sm table-fixed w-full overflow-auto">
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[100px]">ID</th>
                <th className="border py-2 min-w-[250px]">Name</th>
                <th className="border py-2 min-w-[200px]">Email</th>
                <th className="border py-2 min-w-[200px]">User Type</th>
                <th className="border py-2 min-w-[200px]">Status</th>
                <th className="border py-2 min-w-[200px]">
                  <div className="flex justify-center">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {supplierList.message === "No data found!" ||
              supplierList.length === 0 ? (
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
                Array.isArray(supplierList) &&
                supplierList.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-6 py-2 text-center">
                      {row.USER_ID}
                    </td>
                    <td className="border px-6 py-2 text-center">
                      {row.FIRST_NAME} {row.LAST_NAME}
                    </td>
                    <td className="border px-6 py-2">{row.EMAIL}</td>
                    <td className="border px-6 py-2 text-center">
                      {row.USER_TYPE}
                    </td>
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
                        onClick={() => {
                          setSelectedSupplier(row);
                          handleModalToggle(true);
                        }}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white rounded-lg shadow-lg p-6 overflow-auto"
            style={{ width: "400px", height: "80vh" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Member Management</h2>
              <button
                className="text-slate-600 hover:text-main"
                onClick={() => {
                  handleModalToggle();
                }}
              >
                ✖
              </button>
            </div>
            <div>
              <Formik
                initialValues={
                  isEditing && selectedSupplier
                    ? {
                        firstName: selectedSupplier.FIRST_NAME,
                        lastName: selectedSupplier.LAST_NAME,
                        email: selectedSupplier.EMAIL,
                        status: selectedSupplier.STATUS.toString(),
                        userType: selectedSupplier.USER_TYPE || "", 
                      }
                    : initValues
                }
                validationSchema={SuplierValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Row className="flex">
                      <div className="mb-4 col-12">
                        <label
                          htmlFor="firstName"
                          className="text-sm text-gray-600"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.firstName && touched.firstName && (
                          <span className="text-red-500 text-sm block">
                            {errors.firstName}
                          </span>
                        )}
                      </div>
                    </Row>
                    <Row>
                      <div className="mb-4 col-12">
                        <label
                          htmlFor="lastName"
                          className="text-sm text-gray-600"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.lastName && touched.lastName && (
                          <span className="text-red-500 text-sm block">
                            {errors.lastName}
                          </span>
                        )}
                      </div>
                    </Row>
                    <Row>
                      <div className="mb-4 col-12">
                        <label
                          htmlFor="email"
                          className="text-sm text-gray-600"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.email && touched.email && (
                          <span className="text-red-500 text-sm block">
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </Row>
                    <Row>
                      <div className="mb-4 col-12">
                        <label
                          htmlFor="userType"
                          className="text-sm text-gray-600"
                        >
                          User Type
                        </label>
                        <select
                          name="userType"
                          id="userType"
                          value={values.userType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        >
                          <option value="" disabled>
                            Select User Type
                          </option>
                          <option value="Whole Customer">Whole Customer</option>
                        </select>
                        {errors.userType && touched.userType && (
                          <span className="text-red-500 text-sm block">
                            {errors.userType}
                          </span>
                        )}
                      </div>
                    </Row>
                    <Row>
                      <div className="mb-4 col-4">
                        <label className="text-sm text-gray-600">Status</label>
                        <div className="mt-1 flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="status"
                              value="1"
                              checked={values.status === "1"}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="mr-2"
                            />
                            Active
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="status"
                              value="0"
                              checked={values.status === "0"}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="mr-2"
                            />
                            Inactive
                          </label>
                        </div>
                        {errors.status && touched.status && (
                          <span className="text-red-500 text-sm block">
                            {errors.status}
                          </span>
                        )}
                      </div>
                    </Row>

                    <div className="flex justify-end">
                      <button
                        type="reset"
                        onClick={() => {
                          handleModalToggle();
                        }}
                        className="text-white bg-red-600 hover:bg-red-500 px-3 py-1 gap-2 rounded-lg flex items-center mr-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 gap-2 rounded-lg flex items-center"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
      {isLoading && <CommonLoading />}
    </>
  );
};

export default CustomerManagement;
