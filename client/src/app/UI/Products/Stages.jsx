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

const filterValidationSchema = Yup.object({
  product_code: Yup.object().required("required"),

  quantity: Yup.number()
    .required("required")
    .positive("must be greater than 0"),

  updated_date: Yup.date().required("required"),
});

const Stages = () => {
  const [stockList, setstockList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [ProductcreationData, setProductcreationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ProductList, setProductList] = useState([]);

  const [productcreationdata, setproductcreationdata] = useState({});
  const [totalDamageCount, setTotalDamageCount] = useState(0);

  useEffect(() => {
    if (isModalOpen && productcreationdata) {
      setTotalDamageCount(productcreationdata.DAMAGE_COUNT || 0);
    }
  }, [isModalOpen, productcreationdata]);
  const fetchstockListData = async () => {
    try {
      const response = await axios.get("/api/masterdata/get/stock");
      console.log(response);
      setstockList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchProductListData = async () => {
    try {
      const response = await axios.get("/api/productcreationdata/get/list");

      console.log(response);
      setProductList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const options = ProductList.map((item) => ({
    value: item.PRODUCT_CODE,
    label: item.NAME,
  }));

  const stageOrder = stockList
    .filter((item) => item.STATUS === 1)
    .map((item) => item.STOCK_STAGE_TAG.trim());

  const initialStage = productcreationdata?.STAGE;
  const initialStageIndex = stageOrder.indexOf(initialStage);

  const options1 = stockList
    .filter(
      (item) => item.DESCRIPTION && item.STOCK_STAGE_TAG && item.STATUS === 1
    )
    .filter((item) => {
      const itemIndex = stageOrder.indexOf(item.STOCK_STAGE_TAG.trim());
      return itemIndex >= initialStageIndex;
    })
    .map((item) => ({
      label: item.STOCK_STAGE_TAG.trim(),
      value: item.STOCK_STAGE_TAG.trim(),
    }));
  const lastStage =
    stageOrder.length > 0 ? stageOrder[stageOrder.length - 1] : null;
  const fetchproductcreationData = async (page, limit, filter = {}) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/productcreationdata/get?page=${page}&limit=${limit}`,
        filter && Object.keys(filter).length ? filter : {}
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
  const handleEdit = (item) => {
    setIsModalOpen(true);
    setproductcreationdata(item);
  };

  useEffect(() => {
    fetchstockListData();
    fetchProductListData();
  }, []);

  useEffect(() => {
    fetchproductcreationData(currentPage, itemsPerPage);
    console.log(lastStage);
  }, [currentPage, itemsPerPage]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
  const validationSchema_ = Yup.object({
    damage_count: Yup.number()
      .nullable()
      .typeError("Must be a number")
      .required("Required")
      .min(0, "Must be 0 or greater")
      .test(
        "max-damage",
        `Total damage count cannot exceed ${productcreationdata?.QUANTITY}`,
        function (value) {
          if (value === null || value === undefined) return false;
          const totalDamage = (productcreationdata?.DAMAGE_COUNT || 0) + value;
          return totalDamage <= productcreationdata?.QUANTITY;
        }
      ),
  });

  return (
    <>
      <hr className="mt-2" />

      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Product Stages</h2>
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
                toDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
                fromDate: moment().format("YYYY-MM-DD"),
              }}
              validationSchema={filterValidationSchema}
              onSubmit={(values) => {
                console.log(values);
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

                  <div className="mb-1">
                    <label className="form-label">To date</label>
                    <Field
                      type="date"
                      name="toDate"
                      className="form-control"
                      max={moment().format("YYYY-MM-DD")}
                      style={{
                        boxShadow: "none",
                        borderColor: "#ced4da",
                        outline: "none",
                      }}
                    />
                  </div>
                  <div className="mb-1">
                    <label className="form-label">From date</label>
                    <Field
                      type="date"
                      name="fromDate"
                      className="form-control"
                      max={moment().format("YYYY-MM-DD")}
                      style={{
                        boxShadow: "none",
                        borderColor: "#ced4da",
                        outline: "none",
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
                        setFieldValue("product_code", null);

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

        <div className="card-body overflow-auto flex justify-start">
          <table
            id="stock-table"
            className="border text-sm table-fixed w-full overflow-auto"
          >
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[300px]">Product Name</th>
                <th className="border py-2 min-w-[300px]">Quantity</th>
                <th className="border py-2 min-w-[150px]">Created Date</th>
                <th className="border py-2 min-w-[300px]">
                  Total Damage count
                </th>
                <th className="border py-2 min-w-[300px]">Stage</th>
                <th className="border py-2 min-w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody>
              {ProductcreationData?.length > 0 ? (
                ProductcreationData?.map((item) => (
                  <tr key={item.PRODUCT_CODE} className="text-center">
                    <td className="border py-2">{item.PRODUCT_NAME}</td>
                    <td className="border py-2">{item.QUANTITY}</td>
                    <td className="border py-2">
                      {moment(item.UPDATE_DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">{item.DAMAGE_COUNT}</td>
                    <td className="border py-2">{item.STAGE}</td>
                    <td className="border py-2">
                      <button
                        className={`text-slate-500 hover:text-slate-800 border-none ${
                          item.stage === lastStage
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleEdit(item)}
                        disabled={item.stage === lastStage}
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
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="bg-slate-200 rounded-lg w-[500px] h-[450px]">
              <Formik
                initialValues={{
                  product_code: productcreationdata?.PRODUCT_CODE,
                  updated_date: productcreationdata?.UPDATE_DATE || "",
                  damage_count: 0,
                  quantity: productcreationdata?.QUANTITY || 0,
                  stage:
                    options1.find(
                      (option) => option.value === productcreationdata?.STAGE
                    ) || "",
                }}
                validationSchema={validationSchema_}
                onSubmit={async (values) => {
                  console.log("clicked");
                  console.log(values);
                  setIsLoading(true);
                  try {
                    await axios.put(
                      `/api/productcreationdata/update/creation/${productcreationdata.ID}`,
                      {
                        product_code: values?.product_code,
                        updated_date: moment(values?.updated_date).format(
                          "YYYY-MM-DD"
                        ),
                        damage_count: totalDamageCount,
                        stage: values?.stage.value,
                        quantity: values?.quantity,
                      }
                    );

                    toast.success("Product creation data updated successfully");
                    setIsModalOpen(false);
                    fetchproductcreationData(currentPage, itemsPerPage);
                  } catch (error) {
                    toast.error(
                      error.response?.data?.message || "Something went wrong"
                    );
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {({ setFieldValue, values, resetForm }) => (
                  <Form>
                    <div className="flex flex-col text-slate-600">
                      <div className=" flex flex-row justify-end m-3">
                        <button
                          className="text-slate-600 hover:text-main"
                          onClick={() => {
                            setIsModalOpen(false);
                          }}
                        >
                          ✖
                        </button>
                      </div>
                      <h1 className="text-black flex flex-row text-bold  justify-center">
                        Edit Product Creation Note
                      </h1>
                      <div className="flex flex-row">
                        <div className="basis-1/3 flex flex-col gap-3">
                          <label className="flex justify-start  mt-4 ml-2">
                            Product Code
                          </label>
                          <label className="flex justify-start my-3 ml-2">
                            Quantity
                          </label>
                          <label className="flex justify-start my-3 ml-2">
                            Damage Count
                          </label>
                          <label className="flex justify-start mb-3 ml-2">
                            Stage
                          </label>
                        </div>
                        <div className="basis-2/3 flex flex-col gap-2">
                          <Field
                            type="text"
                            name="product_code"
                            className="form-control w-[300px] justify-start mt-4"
                            disabled
                          />
                          <ErrorMessage
                            name="product_code"
                            component="div"
                            className="text-red-500"
                          />
                          <Field
                            type="text"
                            name="quantity"
                            className="form-control w-[300px] justify-start my-2"
                            disabled
                          />
                          <ErrorMessage
                            name="quantity"
                            component="div"
                            className="text-red-500"
                          />
                          <Field
                            type="number"
                            name="damage_count"
                            className=" w-[300px] justify-start my-2 p-2"
                            onChange={(e) => {
                              const newDamage =
                                parseInt(e.target.value, 10) || null;
                              setFieldValue("damage_count", newDamage);
                              setTotalDamageCount(
                                (productcreationdata?.DAMAGE_COUNT || null) +
                                  newDamage
                              );
                            }}
                          />
                          <ErrorMessage
                            name="damage_count"
                            component="div"
                            className="text-red-500"
                          />
                          <Select
                            options={options1}
                            value={values.stage}
                            onChange={(option) =>
                              setFieldValue("stage", option)
                            }
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                            className=" w-[300px] justify-start mb-2"
                          />
                          <ErrorMessage
                            name="stage"
                            component="div"
                            className="text-red-500"
                          />
                        </div>
                      </div>
                      <div className="flex flex-row position-relative gap-2 justify-end my-5 mx-4">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-500 text-white text-sm rounded hover:bg-slate-800"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
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

export default Stages;
