import hero6 from "../assets/hero6.png";
import { Formik, Form } from "formik";
import { FaChevronLeft } from "react-icons/fa";

const Signup = () => {
  const initialValues = {
    fullname: "",
    email: "",
    password: "",
  };

  const onsubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("", {
        Fullname: values.fullname,
        email: values.email,
        password: values.password,
      });
    } catch {}
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Column */}
      <div className="flex items-center justify-right">
        <img
          src={hero6}
          alt="Signup Visual"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right Column*/}
      <div className="bg-white flex flex-col justify-around px-8 py-16">
        <div className="w-full max-w-lg">
          <div className="text-center  flex items-center justify-center space-x-2">
            <FaChevronLeft
              className="text-teal-600 cursor-pointer"
              onClick={() => (window.location.href = "/")}
            />
            <h2 className="text-4xl font-bold text-main">
              Get Started Now
            </h2>
          </div>
          <p className="text-gray-500 text-center mb-8">
            Create your account to join us.
          </p>

          <Formik initialValues={initialValues} onSubmit={onsubmit}>
            {({ getFieldProps, touched, errors }) => (
              <Form className="space-y-6">
                <div>
                  <input
                    placeholder="Full Name"
                    {...getFieldProps("fullname")}
                    type="text"
                    name="fullname"
                    autoComplete="on"
                    style={{ width: "100%" }}
                    className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                  />
                  {touched.fullname && errors.fullname && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.fullname}
                    </div>
                  )}
                </div>

                <div>
                  <input
                    placeholder="Email"
                    {...getFieldProps("email")}
                    type="email"
                    name="email"
                    style={{ width: "100%" }}
                    autoComplete="on"
                    className="bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:outline-none rounded-lg w-full h-14 px-4"
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

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
                  <button
                    type="submit"
                    style={{ width: "100%" }}
                    className="bg-main text-white font-semibold rounded-lg w-full h-14 hover:bg-teal-700 transition duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-8">
            <p className="text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-main font-medium">
                Log In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
