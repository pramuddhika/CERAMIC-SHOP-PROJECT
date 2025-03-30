import { useState } from "react";
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

  const PersonalInformation = () => {
    return (
      <div className="flex">
        <div className="col-4">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <p className="text-lg font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
        <div className="col-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="text-lg font-semibold">{currentUser.email}</p>
        </div>
        <div className="col-4">
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <p className="text-lg font-semibold">{currentUser.role}</p>
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
                    className="min-w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold p-2 rounded-md"
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

  const accordionData = [
    {
      title: "Personal Information",
      content: PersonalInformation(),
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
