import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";
import Nodata from "../../../assets/Nodata.svg";
import CommonPagination from "../../../utils/CommonPagination";
import CommonLoading from "../../../utils/CommonLoading";

const ProductManagementTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [newId, setNewId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [productData, setProductData] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    code: "",
    name: "",
    description: "",
    status: "1",
    category: "",
    subcategory: "",
  });

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      formik.resetForm();
      setIsEdit(false);
      setSelectedImage(null);
      setSelectedFile(null);
      getNewId();
      setInitialValues({
        code: newId,
        name: "",
        description: "",
        status: "1",
        price: "",
        subcategory: "",
        category: "",
      });
    }
  };

  const getNewId = async () => {
    try {
      const Idresponse = await axios.get(`/api/productdata/get/product`);
      setNewId(Idresponse?.data?.newid);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await axios.get("/api/productdata/get/categoryList");
      setCategoryList(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchSubCategoriesByCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/productdata/get/category/${categoryId}`
      );
      setSubCategoryData(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchProductData = async (page, limit) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/productdata/get/tableData/product?page=${page}&limit=${limit}`
      );
      setProductData(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  useEffect(() => {
    getNewId();
    fetchCategoryList();
    fetchProductData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (
        JSON.stringify(values) === JSON.stringify(initialValues) &&
        !selectedFile
      ) {
        toast.info("No changes to update");
        return;
      }

      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("image", selectedFile ?? null);
      formData.append("status", values.status);
      formData.append("category", values.category);
      formData.append("price", values.price);
      formData.append("subcategory", values.subcategory);

      if (!isEdit) {
        try {
          const newSubcategory = await axios.post(
            "/api/productdata/add/product",
            formData
          );
          toast.success(newSubcategory.data.message);
          formik.resetForm();
          setSelectedImage(null);
          getNewId();
          handleModalToggle();
          fetchProductData(currentPage, itemsPerPage);
        } catch (error) {
          console.log("Error:", error.response.data);
          toast.error(error.response.data.error);
        }
      } else {
        try {
          const updateSubcategory = await axios.put(
            `/api/productdata/update/product/${values.code}`,
            formData
          );
          toast.success(updateSubcategory.data.message);
          formik.resetForm();
          setSelectedImage(null);
          handleModalToggle();
          fetchProductData(currentPage, itemsPerPage);
        } catch (error) {
          console.log("Error:", error.response.data);
          toast.error(error.response.data.error);
        }
      }
    },
  });

  const handleEdit = (row) => {
    setIsEdit(true);
    setInitialValues({
      code: row.PRODUCT_CODE,
      name: row.NAME,
      subcategory: row.SUB_CATAGORY_CODE,
      description: row.DESCRIPTION,
      status: row.STATUS === 1 ? "1" : "0",
      price: row.PRICE,
      category: row.CATAGORY_CODE,
    });
    formik.setValues({
      code: row.PRODUCT_CODE,
      name: row.NAME,
      price: row.PRICE,
      description: row.DESCRIPTION,
      status: row.STATUS === 1 ? "1" : "0",
      category: row.CATEGORY_CODE,
    });
    setSelectedImage(`http://localhost:8080/images/${row.IMAGE}`);
    setIsModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    formik.setFieldValue("category", categoryId);
    formik.setFieldValue("subcategory", ""); // Reset subcategory
    setSubCategoryData([]); // Clear existing subcategories
    if (categoryId) {
      fetchSubCategoriesByCategory(categoryId);
    }
  };

  return (
    <div>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex items-center justify-between border-b py-2 bg-gray-100">
          <h2 className="text-xl font-semibold w-full text-start">
            Product Management
          </h2>
          <button
            className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex"
            onClick={handleModalToggle}
          >
            <AiOutlinePlus className="mr-1" />
            Add New
          </button>
        </div>
        <div className="card-body overflow-x-auto">
          <div className="min-w-full">
            <table className="w-full text-sm">
              <thead className="bg-slate-400">
                <tr className="text-center">
                  <th className="border py-2 min-w-[100px]">Image</th>
                  <th className="border py-2 min-w-[130px]">Cat. Code</th>
                  <th className="border py-2 min-w-[130px]">Sub. Code</th>
                  <th className="border py-2 min-w-[130px]">Code</th>
                  <th className="border py-2 min-w-[200px]">Name</th>
                  <th className="border py-2 min-w-[500px]">Description</th>
                  <th className="border py-2 min-w-[100px]">Price</th>
                  <th className="border py-2 min-w-[100px]">Status</th>
                  <th className="border py-2 min-w-[90px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {productData.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <img
                        src={Nodata}
                        style={{
                          width: "150px",
                          margin: "0 auto",
                          padding: "20px",
                        }}
                      />
                      No data found!
                    </td>
                  </tr>
                )}
                {productData.map((row, index) => (
                  <tr key={index}>
                    <td className="border px-6 py-2 w-24">
                      <img
                        src={`http://localhost:8080/images/${row.IMAGE}`}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="border px-6 py-2 w-64 text-center">
                      {row.CATAGORY_CODE}
                    </td>
                    <td className="border px-6 py-2 w-64 text-center">
                      {row.SUB_CATAGORY_CODE}
                    </td>
                    <td className="border px-6 py-2 w-64 text-center">
                      {row.PRODUCT_CODE}
                    </td>
                    <td className="border px-6 py-2 text-center">{row.NAME}</td>
                    <td className="border px-6 py-2">{row.DESCRIPTION}</td>
                    <td className="border px-6 py-2 text-center">Rs.{row.PRICE}</td>
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
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(row)}
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-2/3 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">
                    {isEdit ? "Edit Selected Product" : "Add New Product"}
                  </h2>
                  <button
                    className="text-main hover:text-main"
                    onClick={() => {
                      handleModalToggle();
                      formik.resetForm();
                      setIsEdit(false);
                      setSelectedImage(null);
                      setSelectedFile(null);
                    }}
                  >
                    ✖
                  </button>
                </div>

                <form onSubmit={formik.handleSubmit}>
                  <div className="flex divide-x divide-gray-200">
                    <div className="w-1/3 p-4 flex flex-col items-center">
                      <div className="mb-4">
                        <label className="block">
                          <div className="size-32 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
                            {selectedImage ? (
                              <img
                                src={
                                  selectedImage.startsWith("http")
                                    ? selectedImage
                                    : selectedImage
                                }
                                alt="Selected"
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span className="text-gray-500">
                                Upload Image
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            name="image"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-slate-500 text-white text-sm rounded hover:bg-slate-800"
                        onClick={() =>
                          document.querySelector('input[type="file"]').click()
                        }
                      >
                        Upload Image
                      </button>
                      <div>
                        <label className="block text-sm font-semibold mb-1 mt-4">
                          Product Code
                        </label>
                        <input
                          type="text"
                          name="code"
                          readOnly
                          className="w-full border rounded px-3 py-2 focus:outline-none"
                          placeholder="Code"
                          value={formik.values.code || newId}
                          onChange={formik.handleChange}
                        />
                        <div className="mt-2">
                          <select
                            name="category"
                            className="w-full border rounded px-3 py-2 focus:outline-none"
                            style={{ width: "100%" }}
                            value={formik.values.category}
                            onChange={handleCategoryChange}
                          >
                            <option value="">Select Category</option>
                            {categoryList.map((category) => (
                              <option
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-2">
                          <select
                            name="subcategory"
                            className="w-full border rounded px-3 py-2 focus:outline-none"
                            style={{ width: "100%" }}
                            value={formik.values.subcategory}
                            onChange={formik.handleChange}
                          >
                            <option value="">Select Sub Category</option>
                            {subCategoryData.map((subcategory) => (
                              <option
                                key={subcategory.value}
                                value={subcategory.value}
                              >
                                {subcategory.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-2/3 p-4">
                      <input
                        type="text"
                        name="name"
                        className="w-full border rounded px-3 py-2 mb-4"
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />

                      <input
                        type="text"
                        name="price"
                        className="w-full border rounded px-3 py-2 mb-4"
                        placeholder="Price (in Rs.)"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                      />

                      <textarea
                        name="description"
                        className="w-full min-w-[300px] border rounded px-3 py-2 mb-4"
                        placeholder="Description"
                        rows={4}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                      ></textarea>

                      <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">
                          Status
                        </label>
                        <div className="flex items-center space-x-4">
                          <div>
                            <input
                              type="radio"
                              id="active"
                              name="status"
                              value="1"
                              checked={formik.values.status === "1"}
                              onChange={formik.handleChange}
                              className="mr-2"
                            />
                            <label htmlFor="active" className="text-sm">
                              Active
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="inactive"
                              name="status"
                              value="0"
                              checked={formik.values.status === "0"}
                              onChange={formik.handleChange}
                              className="mr-2"
                            />
                            <label htmlFor="inactive" className="text-sm">
                              Inactive
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                          onClick={() => {
                            handleModalToggle();
                            formik.resetForm();
                            setIsEdit(false);
                            setSelectedImage(null);
                            setSelectedFile(null);
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
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {isLoading && <CommonLoading />}
    </div>
  );
};

export default ProductManagementTab;
