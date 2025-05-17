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

const SuplierManagement = () => {
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
    phone: Yup.string()
      .matches(
        /^(?:0|94|\+94)?(?:(70|71|72|75|76|77|78|79)?\d{7})$/,
        "Invalid phone number"
      )
      .required("Required"),
    line1: Yup.string().max(15, "too long").required("Required"),
    line2: Yup.string().max(15, "too long").required("Required"),
    city: Yup.string().max(30, "too long").required("Required"),
    distric: Yup.string().max(25, "too long").required("Required"),
    province: Yup.string().max(25, "too long").required("Required"),
    postalCode: Yup.string()
      .matches(/^\d{5}$/, "Invalid postal code")
      .required("Required"),
    status: Yup.string().required("Required"),
  });

  const initValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    distric: "",
    province: "",
    postalCode: "",
    status: "1",
  };

  const UserId = async () => {
    try {
      const response = await axios.get("/api/auth/generateUserId");
      setUserId(response.data.newid);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSupplierData = async (page, limit , query = "") => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/auth//getSupplierData?page=${page}&limit=${limit}&${query ? `search=${query}` : ""}`
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
    fetchSupplierData(currentPage, itemsPerPage , searchQuery);
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      fetchSupplierData(currentPage, itemsPerPage);
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
        const response = await axios.post("/api/auth/editSupplier", data);
        toast.success(response.data.message);
        setUserId(null);
        handleModalToggle();
        resetForm();
      } else {
        const response = await axios.post("/api/auth/createSupplier", data);
        setUserId(null);
        toast.success(response.data.message);
        resetForm();
        handleModalToggle();
      }
      fetchSupplierData(currentPage, itemsPerPage);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      setCurrentPage(1);
      fetchSupplierData(1, itemsPerPage , searchQuery);
    }
  }

  return (
    <>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Supplier Management</h2>
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

        <div className="card-body overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full text-sm">
              <thead className="bg-slate-400">
                <tr className="pl-2 text-center">
                  <th className="border py-2 min-w-[150px]">ID</th>
                  <th className="border py-2 min-w-[250px]">Name</th>
                  <th className="border py-2 min-w-[200px]">Email</th>
                  <th className="border py-2 min-w-[200px]">Phone</th>
                  <th className="border py-2 min-w-[200px]">City</th>
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
                        {row.TELEPHONE_NUMBER}
                      </td>
                      <td className="border px-6 py-2 text-center">{row.CITY}</td>
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
            style={{ width: "800px", height: "65vh" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Supplier</h2>
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
                        phone: selectedSupplier.TELEPHONE_NUMBER,
                        line1: selectedSupplier.LINE_1,
                        line2: selectedSupplier.LINE_2,
                        city: selectedSupplier.CITY,
                        distric: selectedSupplier.DISTRICT,
                        province: selectedSupplier.PROVINCE,
                        postalCode: selectedSupplier.POSTAL_CODE,
                        status: selectedSupplier.STATUS.toString(),
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
                      <div className="mb-4 col-4">
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
                      <div className="mb-4 col-4">
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
                      <div className="mb-4 col-4">
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
                    <Row className="flex">
                      <div className="mb-4 col-4">
                        <label
                          htmlFor="phone"
                          className="text-sm text-gray-600"
                        >
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.phone && touched.phone && (
                          <span className="text-red-500 text-sm block">
                            {errors.phone}
                          </span>
                        )}
                      </div>
                      <div className="mb-4 col-4">
                        <label
                          htmlFor="line1"
                          className="text-sm text-gray-600"
                        >
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          name="line1"
                          id="line1"
                          value={values.line1}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.line1 && touched.line1 && (
                          <span className="text-red-500 text-sm block">
                            {errors.line1}
                          </span>
                        )}
                      </div>
                      <div className="mb-4 col-4">
                        <label
                          htmlFor="line2"
                          className="text-sm text-gray-600"
                        >
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          name="line2"
                          id="line2"
                          value={values.line2}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.line2 && touched.line2 && (
                          <span className="text-red-500 text-sm block">
                            {errors.line2}
                          </span>
                        )}
                      </div>
                    </Row>
                    <Row className="flex">
                      <div className="mb-4 col-4">
                        <label htmlFor="city" className="text-sm text-gray-600">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={values.city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                        {errors.city && touched.city && (
                          <span className="text-red-500 text-sm block">
                            {errors.city}
                          </span>
                        )}
                      </div>
                      <div className="mb-4 col-4">
                        <label
                          htmlFor="distric"
                          className="text-sm text-gray-600"
                        >
                          Distric
                        </label>
                        <input
                          type="text"
                          name="distric"
                          id="distric"
                          value={values.distric}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                        {errors.distric && touched.distric && (
                          <span className="text-red-500 text-sm block">
                            {errors.distric}
                          </span>
                        )}
                      </div>
                      <div className="mb-4 col-4">
                        <label
                          htmlFor="province"
                          className="text-sm text-gray-600"
                        >
                          Province
                        </label>
                        <input
                          type="text"
                          name="province"
                          id="province"
                          value={values.province}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                        {errors.province && touched.province && (
                          <span className="text-red-500 text-sm block">
                            {errors.province}
                          </span>
                        )}
                      </div>
                    </Row>

                    <Row>
                      <div className="mb-4 col-4">
                        <label
                          htmlFor="postalCode"
                          className="text-sm text-gray-600"
                        >
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          id="postalCode"
                          value={values.postalCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="w-full border rounded-lg px-3 py-2 mt-1"
                        />
                        {errors.postalCode && touched.postalCode && (
                          <span className="text-red-500 text-sm block">
                            {errors.postalCode}
                          </span>
                        )}
                      </div>
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

export default SuplierManagement;
