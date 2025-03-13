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

const validationSchema = Yup.object({
  product_code: Yup.object().required("required"),

  quantity: Yup.number()
    .required("required")
    .positive("must be greater than 0"),

  updated_date: Yup.date().required("required"),
});

const filterValidationSchema = Yup.object({
  product_code: Yup.object().required("required"),
});

const Creation = () => {
  const [ProductList, setProductList] = useState([]);
  const [stockList, setstockList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [ProductcreationData, setProductcreationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    product: null,
  });

  const fetchProductListData = async () => {
    try {
      const response = await axios.get("/api/productcreationdata/get/list");
      setProductList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchstockListData = async () => {
    try {
      const response = await axios.get("/api/masterdata/get/stock");
      setstockList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const options = ProductList.map((item) => ({
    value: item.PRODUCT_CODE,
    label: item.NAME,
  }));

  const fetchproductcreationData = async (page, limit, filter) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/productcreationdata/get?page=${page}&limit=${limit}&product=${filter?.product}`,
      );
      setProductcreationData(response?.data?.data);
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
    fetchProductListData();
    fetchstockListData();
  }, []);

  useEffect(() => {
    fetchproductcreationData(currentPage, itemsPerPage , filterData);
  }, [currentPage, itemsPerPage , filterData]);

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
          product_code: "",
          quantity: "",
          updated_date: "",

          stage: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const receivedObj = {
            product_code: values?.product_code?.value,
            quantity: values?.quantity,
            create_date: values?.updated_date,
            stage: stockList?.find((stage) => stage.STATUS === 1)
              ?.STOCK_STAGE_TAG,
          };
          try {
            const response = await axios.post(
              "/api/productcreationdata/add/creation",
              receivedObj
            );
            toast.success(response?.data?.message);
            fetchproductcreationData(currentPage, itemsPerPage , filterData);
            resetForm();
            setTimeout(() => {
              setFieldValue("product_code", null);
            }, 0);
          } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="row g-3 p-3 border rounded flex justify-center">
            <div className="col-md-2">
              <label className="form-label">Product Name</label>
              <Select
                options={options}
                value={values.product_code}
                onChange={(option) => setFieldValue("product_code", option)}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />

              <ErrorMessage
                name="product_code"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Quantity (units)</label>
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
                name="updated_date"
                className="form-control"
                max={moment().format("YYYY-MM-DD")}
                style={{
                  boxShadow: "none",
                  borderColor: "#ced4da",
                  outline: "none",
                }}
              />

              <ErrorMessage
                name="updated_date"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-2 flex flex-row items-center justify-end mt-5">
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
            <h2 className="text-lg font-semibold">Product Creation Note</h2>
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
                product_code: "",
              }}
              validationSchema={filterValidationSchema}
              onSubmit={async (values) => {
                console.log(values?.product_code?.value);
                setFilterData({
                  product: values?.product_code?.value,
                })
                setCurrentPage(1);
                fetchproductcreationData(1, itemsPerPage, {
                  product: values?.product_code?.value,
                });
              }}
            >
              {({ setFieldValue, values, resetForm }) => (
                <Form className="flex flex-col">
                  <div className="mb-1">
                    <label className="form-label">Product name</label>
                    <Select
                      options={options}
                      value={values.product_code}
                      onChange={(option) =>
                        setFieldValue("product_code", option)
                      }
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
                        setFieldValue({
                          product: null,
                        });
                        setCurrentPage(1);
                        fetchproductcreationData(1, itemsPerPage, {
                          product: '',
                        });
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
                <th className="border py-2 min-w-[300px]">Product Name</th>
                <th className="border py-2 min-w-[300px]">Quantity (units)</th>
                <th className="border py-2 min-w-[150px]">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {ProductcreationData?.length > 0 ? (
                ProductcreationData?.map((item) => (
                  <tr key={item.PRODUCT_CODE} className="text-center">
                    <td className="border py-2">{item.PRODUCT_NAME}</td>
                    <td className="border py-2">{item.QUANTITY}</td>
                    <td className="border py-2">
                      {moment(item.CREATE_DATE).format("YYYY-MM-DD")}
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

export default Creation;
