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
  const [filterData, setFilterData] = useState({
    product: null,
  });

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
  const lastStage = stageOrder.length > 0 ? stageOrder[stageOrder.length - 1] : null;

  const fetchproductcreationData = async (page, limit, filter) => {
    setIsLoading(true);
    setProductcreationData([]);
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
  const handleEdit = (item) => {
    setIsModalOpen(true);
    setproductcreationdata(item);
  };

  useEffect(() => {
    fetchstockListData();
    fetchProductListData();
  }, []);

  useEffect(() => {
    fetchproductcreationData(currentPage, itemsPerPage , filterData);
  }, [currentPage, itemsPerPage, filterData]);

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
                product_code: filterData.product ? options.find(option => option.value === filterData.product) : "",
              }}
              validationSchema={filterValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                setFilterData({
                  product: values?.product_code?.value,
                });
                setCurrentPage(1);
                fetchproductcreationData(1, itemsPerPage, {
                  product: values?.product_code?.value,
                });
                setSubmitting(false);
                toggleFilter();
              }}
            >
              {({ setFieldValue, values, errors, resetForm, touched }) => (
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
                    {errors.product_code && touched.product_code && (
                      <div className="text-red-500">{errors.product_code}</div>
                    )}
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
                        setFilterData({
                          product: null,
                        });
                        setCurrentPage(1);
                        fetchproductcreationData(1, itemsPerPage, {
                          product: '',
                        });
                        toggleFilter();
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
                <th className="border py-2 min-w-[150px]">Last Update Date</th>
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
                      {moment(item.CREATE_DATE).format("YYYY-MM-DD")}
                    </td>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg w-[500px] p-3 shadow-lg">
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
                  setIsLoading(true);
                  try {
                    await axios.put(
                      `/api/productcreationdata/update/creation/${productcreationdata.ID}`,
                      {
                        product_code: values?.product_code,
                        updated_date: moment().format("YYYY-MM-DD"),
                        damage_count: totalDamageCount,
                        stage: values?.stage.value,
                        quantity: values?.quantity,
                      }
                    );
                    await fetchproductcreationData(currentPage, itemsPerPage , filterData);
                    toast.success("Product creation data updated successfully");
                    setIsModalOpen(false);
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
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-slate-600 hover:text-red-600"
                          onClick={() => setIsModalOpen(false)}
                        >
                          ✖
                        </button>
                      </div>
                      <h1 className="text-black text-lg font-bold text-center mb-4">
                        Edit Product Creation Note
                      </h1>
                      <div className="flex flex-col gap-3">
                        <label>Product Code</label>
                        <Field
                          type="text"
                          name="product_code"
                          className="form-control w-full p-2 border rounded"
                          disabled
                        />
                        <ErrorMessage
                          name="product_code"
                          component="div"
                          className="text-red-500"
                        />

                        <label>Quantity</label>
                        <Field
                          type="text"
                          name="quantity"
                          className="form-control w-full p-2 border rounded"
                          disabled
                        />
                        <ErrorMessage
                          name="quantity"
                          component="div"
                          className="text-red-500"
                        />

                        <label>Damage Count</label>
                        <Field
                          type="number"
                          name="damage_count"
                          className="w-full p-2 border rounded focus:outline-none"
                          onChange={(e) => {
                            const newDamage = parseInt(e.target.value, 10) || 0;
                            setFieldValue("damage_count", newDamage);
                            setTotalDamageCount(
                                newDamage
                            );
                          }}
                        />
                        <ErrorMessage
                          name="damage_count"
                          component="div"
                          className="text-red-500"
                        />

                        <label>Stage</label>
                        <Select
                          options={options1}
                          value={values.stage}
                          onChange={(option) => setFieldValue("stage", option)}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          className="w-full"
                        />
                        <ErrorMessage
                          name="stage"
                          component="div"
                          className="text-red-500"
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-5">
                        <button
                          type="button"
                          className="text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                          onClick={() => {
                            resetForm();
                            setIsModalOpen(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-white bg-cyan-950 hover:bg-cyan-900 px-4 py-2 rounded-lg"
                          disabled={isLoading}
                        >
                          {isLoading ? "Submitting..." : "Submit"}
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
