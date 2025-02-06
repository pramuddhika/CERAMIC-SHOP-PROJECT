// To do: Create a UI for the Supplies Management page , can addd , in edit can deactivate and activate the supplier
import { Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Row } from "react-bootstrap";

const SuplierManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = async () => {
    setIsModalOpen(!isModalOpen);
  };

  const SuplierValidationSchema = Yup.object().shape({
    firsName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    phone: Yup.string().required("Required"),
    line1: Yup.string().required("Required"),
    line2: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    distric: Yup.string().required("Required"),
    province: Yup.string().required("Required"),
    postalCode: Yup.string().required("Required"),
    status: Yup.string().required("Required"),
  });

  const initValues = {
    firsName: "",
    lastName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    distric: "",
    province: "",
    postalCode: "",
    status: "",
  };

  const handleSubmit = async (values) => {
    console.log(values);
  };

  return (
    <>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Supplier Management</h2>
          </div>
          <button
            className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 gap-2 rounded-lg flex items-center"
            onClick={handleModalToggle}
          >
            <i className="bi bi-person-plus"></i>
            Add New
          </button>
        </div>

        <div className="card-body overflow-auto flex justify-center">
          <table className="border text-sm table-fixed w-full overflow-auto">
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[200px]">ID</th>
                <th className="border py-2 min-w-[280px]">Name</th>
                <th className="border py-2 min-w-[200px]">Email</th>
                <th className="border py-2 min-w-[200px]">Phone</th>
                <th className="border py-2 min-w-[200px]">City</th>
                <th className="border py-2 min-w-[200px]">Status</th>
                <th className="border py-2 min-w-[200px]">
                  <div className="flex justify-center">Actions</div>
                </th>
              </tr>
            </thead>
            {/* <tbody className="divide-y">
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
                                    // onClick={() => handleEdit(row)}
                                  >
                                    {/* <FaEdit /> 
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody> */}
          </table>
        </div>
        {/* <CommonPagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    /> */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ width: "800px", height: "70vh" }}
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
                initialValues={initValues}
                validationSchema={SuplierValidationSchema}
                onSubmit={handleSubmit}
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
                          htmlFor="firsName"
                          className="text-sm text-gray-600"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firsName"
                          id="firsName"
                          value={values.firsName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border rounded-lg px-3 py-2 mt-1"
                          style={{ width: "100%" }}
                        />
                        {errors.firsName && touched.firsName && (
                          <span className="text-red-500 text-sm">
                            {errors.firsName}
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
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
                          <span className="text-red-500 text-sm">
                            {errors.province}
                          </span>
                        )}
                      </div>
                    </Row>

                    <div className="mb-4">
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
                        <span className="text-red-500 text-sm">
                          {errors.postalCode}
                        </span>
                      )}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="status" className="text-sm text-gray-600">
                        Status
                      </label>
                      <input
                        type="text"
                        name="status"
                        id="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                      {errors.status && touched.status && (
                        <span className="text-red-500 text-sm">
                          {errors.status}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="reset"
                        onClick={() => {
                          Formik.resetForm();
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
    </>
  );
};

export default SuplierManagement;
