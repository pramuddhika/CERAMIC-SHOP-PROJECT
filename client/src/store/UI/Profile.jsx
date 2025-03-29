import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("User"));
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressData, setAddressData] = useState([]);

  const fetchAddressData = async () => {
    try {
      const response = await axios.get(
        `/api/shopdata/getAddressData/${currentUser.id}`
      );
      setAddressData(response.data);
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, []);

  const settingFormInitialValues = {
    password: "",
    reEnterPassword: "",
  };

  const settingormSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    reEnterPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password is required"),
  });

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const addressFormInitialValues = {
    tag: "",
    phoneNumber: "",
    line1: "",
    line2: "",
    city: "",
    district: "",
    state: "",
    zipCode: "",
  };

  const addressFormSchema = Yup.object().shape({
    tag: Yup.string()
      .max(20, "Too long!")
      .required("Tag is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    line1: Yup.string()
      .max(15, "Too long!")
      .required("Line 1 is required"),
    line2: Yup.string().max(15, "Too long!"),
    city: Yup.string()
      .max(30, "Too long!")
      .required("City is required"),
    district: Yup.string()
      .max(25, "Too long!")
      .required("District is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string()
      .matches(/^\d{5}$/, "Zip code must be 5 digits")
      .required("Zip code is required"),
  });

  const PersonalInformation = () => {
    return (
      <div className="flex">
        <div className="col-6">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <p className="text-lg font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
        <div className="col-6">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="text-lg font-semibold">{currentUser.email}</p>
        </div>
      </div>
    );
  };

  const Settings = () => {
    return (
      <div className="mb-4">
        <Formik
          enableReinitialize
          initialValues={settingFormInitialValues}
          validationSchema={settingormSchema}
          onSubmit={async (values) => {
            const data = {
              userId: currentUser.id,
              password: values.password,
            };
            try {
              await axios.post("/api/auth/registerUser", data);
              toast.success("Password updated successfully");
              values.password = "";
              values.reEnterPassword = "";
            } catch (error) {
              console.log(error);
              toast.error("Something went wrong");
            }
          }}
        >
          {({ getFieldProps, touched, errors }) => (
            <Form className="space-y-6">
              <div className="flex gap-3 items-center justify-center">
                <div className="col-5">
                  <div className="relative w-full">
                    <input
                      placeholder="Password"
                      {...getFieldProps("password")}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="on"
                      style={{ width: "100%" }}
                      className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>
                <div className="col-5">
                  <div className="relative w-full">
                    <input
                      placeholder="Re-enter Password"
                      {...getFieldProps("reEnterPassword")}
                      type={showRePassword ? "text" : "password"}
                      name="reEnterPassword"
                      autoComplete="on"
                      style={{ width: "100%" }}
                      className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRePassword((prev) => !prev)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showRePassword ? (
                        <EyeOffIcon className="w-5 h-5 text-gray-500" />
                      ) : (
                        <EyeIcon className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {touched.reEnterPassword && errors.reEnterPassword && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.reEnterPassword}
                    </div>
                  )}
                </div>
                <div className="col-1">
                  <button
                    type="submit"
                    className="min-w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  };

  const Addressbook = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <p>
            <span className="text-lg font-semibold text-gray-700">
              Manage your address book
            </span>
          </p>
          <button
            onClick={() => setIsModalOpen(true)} 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 rounded-md"
          >
            Add New Address
          </button>
        </div>
        <div className="mt-2">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="min-w-[70px] py-2 px-4 text-left text-gray-600 font-medium">
                  Tag
                </th>
                <th className="min-w-[100px] py-2 px-4 text-left text-gray-600 font-medium">
                  Phone Number
                </th>
                <th className="min-w-[120px] py-2 px-4 text-left text-gray-600 font-medium">
                  Line 1
                </th>
                <th className="min-w-[120px] py-2 px-4 text-left text-gray-600 font-medium">
                  Line 2
                </th>
                <th className="min-w-[80px] py-2 px-4 text-left text-gray-600 font-medium">
                  City
                </th>
                <th className="min-w-[90px] py-2 px-4 text-left text-gray-600 font-medium">
                  District
                </th>
                <th className="min-w-[90px] py-2 px-4 text-left text-gray-600 font-medium">
                  State
                </th>
                <th className="min-w-[60px] py-2 px-4 text-left text-gray-600 font-medium">
                  Zip Code
                </th>
              </tr>
            </thead>
            <tbody>
              {addressData.map((address, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.TAG}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.TELEPHONE_NUMBER}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.LINE_1}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.LINE_2}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.CITY}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.DISTRICT}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.PROVINCE}
                  </td>
                  <td className="py-2 px-4 text-gray-700 font-medium">
                    {address.POSTAL_CODE}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div
              className="bg-white rounded-lg shadow-lg p-4 overflow-auto"
              style={{ width: "1000px", height: "50vh" }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Add New Address</h2>
                <button
                  className="text-slate-600 hover:text-main"
                  onClick={() => setIsModalOpen(false)} 
                >
                  ✖
                </button>
              </div>
              <Formik
                initialValues={addressFormInitialValues}
                validationSchema={addressFormSchema}
                onSubmit= {async (values) => {
                  const data = {
                    userId: currentUser.id,
                    ...values
                  }
                  try {
                    const addAddressData = await axios.post("/api/shopdata/addAddressData", data);
                    toast.success(addAddressData.data.message);
                    fetchAddressData();
                    setIsModalOpen(false);
                  } catch (error) {
                    console.log(error);
                    toast.error("Something went wrong");
                  }
                }}
              >
                {({ getFieldProps, touched, errors }) => (
                  <Form>
                    <div className="grid grid-cols-4 gap-4 mb-2">
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          Tag
                        </label>
                        <input
                          {...getFieldProps("tag")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.tag && errors.tag && (
                          <span className="text-red-500 text-sm block">
                            {errors.tag}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          Phone Number
                        </label>
                        <input
                          {...getFieldProps("phoneNumber")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                          <span className="text-red-500 text-sm block">
                            {errors.phoneNumber}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          Line 1
                        </label>
                        <input
                          {...getFieldProps("line1")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.line1 && errors.line1 && (
                          <span className="text-red-500 text-sm block">
                            {errors.line1}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          Line 2
                        </label>
                        <input
                          {...getFieldProps("line2")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-2">
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          City
                        </label>
                        <input
                          {...getFieldProps("city")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.city && errors.city && (
                          <span className="text-red-500 text-sm block">
                            {errors.city}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          District
                        </label>
                        <input
                          {...getFieldProps("district")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.district && errors.district && (
                          <span className="text-red-500 text-sm block">
                            {errors.district}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          State
                        </label>
                        <input
                          {...getFieldProps("state")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.state && errors.state && (
                          <span className="text-red-500 text-sm block">
                            {errors.state}
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm text-gray-600">
                          Zip Code
                        </label>
                        <input
                          {...getFieldProps("zipCode")}
                          className="border rounded-lg px-3 py-2 mt-1 w-full"
                        />
                        {touched.zipCode && errors.zipCode && (
                          <span className="text-red-500 text-sm block">
                            {errors.zipCode}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold p-2 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold p-2 rounded-md"
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </div>
    );
  };

  const accordionData = [
    {
      title: "Personal Information",
      content: PersonalInformation(),
    },
    {
      title: "Address Book",
      content: Addressbook(),
    },
    ...(currentUser.role === "Whole Customer"
      ? [
          {
            title: "To Pay",
            content: "View your past orders and purchase history.",
          },
        ]
      : []),
    {
      title: "Order History",
      content: "View your past orders and purchase history.",
    },
    {
      title: "Settings",
      content: Settings(),
    },
  ];
  

  return (
    <div className="max-w-full mx-auto p-4 space-y-4">
      {accordionData.map((item, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleAccordion(index)}
            className="flex  items-center p-4 bg-white hover:bg-gray-50 transition-colors duration-200 min-w-full"
          >
            <div className="flex justify-between items-center m-2 min-w-full">
              <div>
                <span className="font-medium text-lg">{item.title}</span>
              </div>
              <div>
                {!isModalOpen && ( 
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${
                      openAccordion === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </button>
          <div
            className={`transition-all duration-200 ease-in-out ${
              openAccordion === index
                ? "opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="p-4 bg-gray-50">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
