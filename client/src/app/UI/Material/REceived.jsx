import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import Nodata from "../../../assets/Nodata.svg";
import CommonPagination from "../../../utils/CommonPagination";
import CommonLoading from "../../../utils/CommonLoading";
import { FaEdit } from "react-icons/fa";

const validationSchema = Yup.object({
  material: Yup.object().required("required"),
  supplier: Yup.object().required("required"),
  value: Yup.number().required("required").positive("must be greater than 0"),
  quantity: Yup.number()
    .required("required")
    .positive("must be greater than 0"),
  date: Yup.date().required("required"),
});

const filterValidationSchema = Yup.object({
  material: Yup.object().nullable(),
  supplier: Yup.object().nullable(),
});

const Received = () => {
  const [meterialList, setMaterialList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [receivedData, setReceivedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    material: null,
    supplier: null,
  });

  const fetchMaterialListData = async () => {
    try {
      const response = await axios.get("/api/materialdata/get/list");
      setMaterialList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSupplierListData = async () => {
    try {
      const response = await axios.get("/api/auth/getSupplierList");
      setSupplierList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const options = meterialList.map((item) => ({
    value: item.MATERIAL_ID,
    label: item.NAME,
  }));

  const supplierOptions = supplierList.map((item) => ({
    value: item.USER_ID,
    label: item.FIRST_NAME + " " + item.LAST_NAME,
  }));

  const fetchMaterialReceivedtData = async (page, limit, filters) => {
    setIsLoading(true);
    try {
      const { material, supplier} = filters;
      const response = await axios.get(
        `/api/materialdata/get/received?page=${page}&limit=${limit}&material=${
          material?.value || ""
        }&supplier=${supplier?.value || ""}`
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
    fetchMaterialListData();
    fetchSupplierListData();
    fetchMaterialReceivedtData(1, itemsPerPage, {
      material: null,
      supplier: null,
    });
  }, []);

  useEffect(() => {
    fetchMaterialReceivedtData(currentPage, itemsPerPage, filterData);
  }, [currentPage, itemsPerPage, filterData]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  return (
    <>
      <Formik
        initialValues={{
          material: "",
          supplier: "",
          value: "",
          quantity: "",
          date: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const receivedObj = {
            materialId: values?.material?.value,
            supplierId: values?.supplier?.value,
            date: values?.date,
            quantity: values?.quantity,
            value: values?.value,
          };
          try {
            const response = await axios.post(
              "/api/materialdata/add/received",
              receivedObj
            );
            toast.success(response?.data?.message);
            fetchMaterialReceivedtData(currentPage, itemsPerPage);
            resetForm();
            setTimeout(() => {
              setFieldValue("material", null);
              setFieldValue("supplier", null);
            }, 0);
          } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="row g-3 p-3 border rounded">
            <div className="col-md-2">
              <label className="form-label">Material</label>
              <Select
                options={options}
                value={values.material}
                onChange={(option) => setFieldValue("material", option)}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />

              <ErrorMessage
                name="material"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Supplier</label>
              <Select
                options={supplierOptions}
                value={values.supplier}
                onChange={(option) => setFieldValue("supplier", option)}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />

              <ErrorMessage
                name="supplier"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Value (Rs.)</label>
              <Field
                type="number"
                name="value"
                className="form-control"
                style={{
                  boxShadow: "none",
                  borderColor: "#ced4da",
                  outline: "none",
                }}
              />
              <ErrorMessage
                name="value"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Quantity (Kg)</label>
              <Field
                type="number"
                name="quantity"
                className="form-control"
                style={{
                  boxShadow: "none",
                  borderColor: "#ced4da",
                  outline: "none",
                }}
              />
              <ErrorMessage
                name="quantity"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <Field
                type="date"
                name="date"
                className="form-control"
                max={moment().format("YYYY-MM-DD")}
                style={{
                  boxShadow: "none",
                  borderColor: "#ced4da",
                  outline: "none",
                }}
              />

              <ErrorMessage
                name="date"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-2 flex items-center justify-end">
              <button
                type="submit"
                className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
              >
                Add New +
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <hr className="mt-2" />

      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Material Received Note</h2>
          </div>
          <div className="flex items-center">
            <button
              className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center ml-2"
              onClick={toggleFilter}
            >
              <i className="bi bi-funnel"></i>
            </button>
          </div>
        </div>

        {showFilter && (
          <div
            className="absolute bg-white border rounded-lg p-3 shadow-lg overflow-y-auto"
            style={{
              zIndex: 9999,
              top: "40px",
              right: "-6%",
              transform: "translateX(-50%)",
              maxHeight: "400px",
            }}
          >
            <Formik
              initialValues={{
                material: null,
                supplier: null,
                toDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
                fromDate: moment().format("YYYY-MM-DD"),
              }}
              validationSchema={filterValidationSchema}
              onSubmit={(values) => {
                setFilterData(values);
                fetchMaterialReceivedtData(currentPage, itemsPerPage, values);
                toggleFilter();
              }}
            >
              {({ setFieldValue, values, resetForm }) => (
                <Form className="flex flex-col">
                  <div className="mb-1">
                    <label className="form-label">Material</label>
                    <Select
                      options={options}
                      value={values.material}
                      onChange={(option) => setFieldValue("material", option)}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <div className="mb-1">
                    <label className="form-label">Supplier</label>
                    <Select
                      options={supplierOptions}
                      value={values.supplier}
                      onChange={(option) => setFieldValue("supplier", option)}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                    />
                  </div>
                  <div className="flex justify-end space-x-8 mt-2">
                    <button
                      type="submit"
                      className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg flex items-center"
                      onClick={() => {
                        resetForm();
                        setFieldValue("material", null);
                        setFieldValue("supplier", null);
                        setFieldValue(
                          "toDate",
                          moment().subtract(7, "days").format("YYYY-MM-DD")
                        );
                        setFieldValue(
                          "fromDate",
                          moment().format("YYYY-MM-DD")
                        );
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

        <div className="card-body overflow-auto flex justify-center">
          <table
            id="stock-table"
            className="border text-sm table-fixed w-full overflow-auto"
          >
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[300px]">Material Name</th>
                <th className="border py-2 min-w-[300px]">Supplier</th>
                <th className="border py-2 min-w-[150px]">Quality</th>
                <th className="border py-2 min-w-[300px]">Date</th>
                <th className="border py-2 min-w-[300px]">Quantity</th>
                <th className="border py-2 min-w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {receivedData?.length > 0 ? (
                receivedData?.map((item) => (
                  <tr key={item.RECEIVED_ID} className="text-center">
                    <td className="border py-2">{item.NAME}</td>
                    <td className="border py-2">
                      {item.FIRST_NAME} {item.LAST_NAME}
                    </td>
                    <td className="border py-2">
                      {item.QUALITY === "checking" ? (
                        <td className="flex justify-center py-1">
                          <span className="text-white bg-yellow-600 py-2 px-4 rounded-2xl">
                            Checking
                          </span>
                        </td>
                      ) : (
                        <td>
                          <span className="text-white bg-green-600 py-2 px-4 rounded-2xl">
                            Passed
                          </span>
                        </td>
                      )}
                    </td>
                    <td className="border py-2">
                      {moment(item.DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">{item.QUANTITY} kg</td>
                    <td className="border py-2">
                      <button
                        className="text-slate-500 hover:text-slate-800 border-none"
                        onClick={() => {
                          console.log(item);
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
      {isLoading && <CommonLoading />}
    </>
  );
};

export default Received;
