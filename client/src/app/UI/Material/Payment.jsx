import { Formik, Form } from "formik";
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
  material: Yup.object().nullable(),
  supplier: Yup.object().nullable(),
});
const Payment = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState("");

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
      const { material, supplier } = filters;
      const response = await axios.get(
        `/api/materialdata/get/payment?page=${page}&limit=${limit}&material=${
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

  const handleQualityUpdate = async () => {
    const updateData = {
      materialId: selectedItem?.MATERIAL_ID,
      supplierId: selectedItem?.USER_ID,
      date: moment(selectedItem?.DATE).format("YYYY-MM-DD"),
      quantity: selectedItem?.QUANTITY,
      Payment: selectedQuality,
    };
    try {
      const response = await axios.put(
        "/api/materialdata/quality/update",
        updateData
      );
      toast.success(response?.data?.message);
      fetchMaterialReceivedtData(currentPage, itemsPerPage, filterData);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
    setIsModalOpen(false);
    setSelectedItem(null);
    setSelectedQuality("");
  };
  
  console.log('1111111',selectedItem)
  console.log('2222222',parseInt(selectedItem?.MATERIAL_VALUE))
  console.log('3333333',(selectedQuality))
  console.log('4444444',parseInt(selectedItem?.PAID_VALUE) === 'NaN' ? 0 : parseInt(selectedItem?.PAID_VALUE))
  console.log('5555555',parseInt(selectedItem?.MATERIAL_VALUE) < parseInt(selectedQuality) + parseInt(selectedItem?.PAID_VALUE))

  return (
    <>
      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Suppiler Payment Note</h2>
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
                fetchMaterialReceivedtData(currentPage, itemsPerPage, values);
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
                        setFilterData({
                          material: null,
                          supplier: null,
                        });
                        fetchMaterialReceivedtData(currentPage, itemsPerPage, {
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

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
            style={{ zIndex: 9998 }}
          >
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Update Payment for</h2>
              <div className="flex justify-center items-center gap-3">
                <div className="min-w-40 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Material
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-500">{selectedItem?.NAME}</span>
                  </div>
                </div>
                <div className="min-w-40 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Supplier
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-500">
                      {selectedItem?.FIRST_NAME} {selectedItem?.LAST_NAME}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-3">
                <div className="min-w-40 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Value
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-500">
                      Rs. {selectedItem?.MATERIAL_VALUE}
                    </span>
                  </div>
                </div>
                <div className="min-w-40 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-500">
                      {selectedItem?.QUANTITY} kg
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center gap-3">
                <div className="min-w-40 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Received Date
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="text-gray-500">
                      {moment(selectedItem.DATE).format("DD-MM-YYYY")}
                    </span>
                  </div>
                </div>
                <div className="min-w-40 mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Paid Value
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <span className="text-gray-500">
                      {selectedItem?.PAID_VALUE
                        ? `Rs. ${selectedItem?.PAID_VALUE}`
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  New Paid Value
                </label>
                <div className="mt-1 flex justify-center items-center gap-3 space-x-4 fo">
                  Rs.
                  <input
                    type="number"
                    className="border rounded-lg px-2 py-1 w-48"
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    style={{
                      boxShadow: "none",
                      borderColor: "#ced4da",
                      outline: "none",
                    }}
                  />
                </div>
                {parseInt(selectedItem?.MATERIAL_VALUE) <
                  parseInt(selectedQuality) + parseInt(selectedItem?.PAID_VALUE) && (
                  <label className="text-red-600">Invalid amount!</label>
                )}
              </div>

              <div className="flex justify-end space-x-6">
                <button
                  type="button"
                  disabled={
                    parseInt(selectedItem?.MATERIAL_VALUE) <
                    parseInt(selectedQuality) + parseInt(selectedItem?.PAID_VALUE)
                  }
                  className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center"
                  onClick={handleQualityUpdate}
                >
                  Update
                </button>
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded-lg flex items-center"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
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
                <th className="border py-2 min-w-[150px]">value</th>
                <th className="border py-2 min-w-[200px]">Received Date</th>
                <th className="border py-2 min-w-[200px]">Quantity</th>
                <th className="border py-2 min-w-[150px]">Paid Value</th>
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
                    <td className="border py-3">Rs. {item.MATERIAL_VALUE}</td>

                    <td className="border py-2">
                      {moment(item.DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">{item.QUANTITY} kg</td>
                    <td className="border py-2">
                      {item.PAID_VALUE ? `Rs. ${item.PAID_VALUE}` : "-"}
                    </td>
                    <td className="border py-2">
                      <button
                        className="text-slate-500 hover:text-slate-800 border-none"
                        disabled={item.PAID_VALUE === item.MATERIAL_VALUE}
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
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

export default Payment;
