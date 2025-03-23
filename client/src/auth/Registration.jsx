import hero6 from "../assets/hero6.png";
import { Formik, Form } from "formik";
import { Row } from "react-bootstrap";
import * as Yup from "yup";
import { useEffect } from "react";

const Registration = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    password: "",
    reEnterPassword: "",
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      console.log("Token:", token);
    }
  }, []);

  const RegisterSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("required"),
    repassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("required"),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Column */}
      <div className="flex items-center justify-cente">
        <img
          src={hero6}
          alt="About Us"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right Column */}
      <div className="bg-white flex flex-col justify-around px-8 py-16">
        <div className="w-full max-w-[800px] mx-auto">
          <div className="text-center  flex items-center justify-center space-x-2">
            <h2 className="text-4xl font-bold text-main">Registration</h2>
          </div>
          <p className="text-gray-500 text-center mb-8">Welcome to Our Shop.</p>

          <Formik
            initialValues={initialValues}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ getFieldProps, touched, errors }) => (
              <Form className="space-y-6">
                <Row>
                  <div className="col-md-6">
                    <label className="text-teal-600">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      {...getFieldProps("firstName")}
                      style={{ width: "100%" }}
                      className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-teal-600">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      {...getFieldProps("lastName")}
                      style={{ width: "100%" }}
                      className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                    />
                  </div>
                </Row>
                <Row>
                  <div className="col-md-6">
                    <label className="text-teal-600">Email</label>
                    <input
                      type="text"
                      name="email"
                      {...getFieldProps("email")}
                      style={{ width: "100%" }}
                      className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="text-teal-600">User Type</label>
                    <input
                      type="text"
                      name="userType"
                      {...getFieldProps("userType")}
                      style={{ width: "100%" }}
                      className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                    />
                  </div>
                </Row>

                <div>
                  <input
                    placeholder="Password"
                    {...getFieldProps("password")}
                    type="password"
                    name="password"
                    autoComplete="on"
                    style={{ width: "100%" }}
                    className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                  />
                  {touched.password && errors.password && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    placeholder="Re-enter Password"
                    {...getFieldProps("reEnterPassword")}
                    type="password"
                    name="reEnterPassword"
                    autoComplete="on"
                    style={{ width: "100%" }}
                    className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                  />
                  {touched.reEnterPassword && errors.reEnterPassword && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.reEnterPassword}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    style={{ width: "100%" }}
                    className="bg-main text-white font-semibold rounded-lg w-full h-14 hover:bg-teal-700 transition duration-300"
                  >
                    Register
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Registration;
