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
  material: Yup.object().required("required"),
  quantity: Yup.number()
    .required("required")
    .positive("must be greater than 0"),
});

const filterValidationSchema = Yup.object({
  material: Yup.object().nullable(),
});
const Use = () => {
  const [meterialList, setMaterialList] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [materialUsageData, setMaterialUsageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({
    material: null,
  });

  const fetchMaterialListData = async () => {
    try {
      const response = await axios.get("/api/materialdata/get/list");
      setMaterialList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const options = meterialList.map((item) => ({
    value: item.MATERIAL_ID,
    label: item.NAME,
  }));

  const fetchMaterialUsageData = async (page, limit, filters) => {
    setIsLoading(true);
    try {
      const { material} = filters;
      const response = await axios.get(
        `/api/materialdata/get/usage?page=${page}&limit=${limit}&material=${
          material?.value || ""}`
      );
      setMaterialUsageData(response?.data?.data);
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
    fetchMaterialUsageData(1, itemsPerPage, {
      material: null,
      supplier: null,
    });
  }, []);

  useEffect(() => {
    fetchMaterialUsageData(currentPage, itemsPerPage, filterData);
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
          quantity: "",
          date: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const receivedObj = {
            materialId: values?.material?.value,
            date: values?.date,
            quantity: values?.quantity,
          };
          try {
            const response = await axios.post(
              "/api/materialdata/add/usage",
              receivedObj
            );
            toast.success(response?.data?.message);
            resetForm();
            setTimeout(() => {
              setFieldValue("material", null);
            }, 0);
            fetchMaterialUsageData(currentPage, itemsPerPage, filterData)
          } catch (error) {
            toast.error(error?.response?.data?.error);
            console.error(error);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="row g-3 p-3 border rounded flex justify-center">
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
            <h2 className="text-lg font-semibold">Material Usage Note</h2>
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
                material: filterData.material,
                supplier: filterData.supplier,
              }}
              validationSchema={filterValidationSchema}
              onSubmit={(values) => {
                setFilterData(values);
                setCurrentPage(1);
                fetchMaterialUsageData(1, itemsPerPage, values);
                toggleFilter();
              }}
            >
              {({ setFieldValue, values, resetForm }) => (
                <Form className="flex flex-col">
                  <div className="mb-1" style={{ width: "250px" }}>
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
                        setFilterData({
                          material: null,
                          supplier: null,
                        });
                        setCurrentPage(1);
                        fetchMaterialUsageData(1, itemsPerPage, {
                          material: null,
                          supplier: null,
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

        <div className="card-body overflow-auto flex justify-center">
          <table
            id="stock-table"
            className="border text-sm table-fixed w-full overflow-auto"
          >
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[300px]">Material Name</th>
                <th className="border py-2 min-w-[300px]">Date</th>
                <th className="border py-2 min-w-[100px]">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {materialUsageData?.length > 0 ? (
                materialUsageData?.map((item) => (
                  <tr key={item.RECEIVED_ID} className="text-center">
                    <td className="border py-2">{item.NAME}</td>
                    <td className="border py-2">
                      {moment(item.DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">{item.QUANTITY} kg</td>
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

export default Use;
