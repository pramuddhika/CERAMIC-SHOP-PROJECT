import hero6 from "../assets/hero6.png";
import { Formik, Form } from "formik";
import { FaChevronLeft } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await axios.post("http://your-backend-api.com/login", {
        email: values.email,
        password: values.password,
      });

      const { token } = response.data;

      localStorage.setItem("jwtToken", token);

      console.log("Login successful. Token saved.");
      resetForm();
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left Column */}
      <div className="flex items-center justify-center bg-slate-500 shadow">
        <img
          src={hero6}
          alt="About Us"
          className="w-full h-screen object-cover"
        />
      </div>

      {/* Right Column */}
      <div className="bg-white flex flex-col justify-around shadow px-8 py-16">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-center  flex items-center justify-center space-x-2">
            <FaChevronLeft
              className="text-main cursor-pointer"
              onClick={() => (window.location.href = "/")}
            />
            <h2 className="text-4xl font-bold text-main">Welcome Back</h2>
          </div>
          <p className="text-gray-500 text-center mb-8">
            Please log in to your account.
          </p>

          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {({ getFieldProps, touched, errors }) => (
              <Form className="space-y-6">
                <div>
                  <input
                    placeholder="Email"
                    {...getFieldProps("email")}
                    type="email"
                    name="email"
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
                    className="bg-main text-white font-semibold rounded-lg w-full h-14 hover:bg-teal-700 transition duration-300"
                  >
                    Sign In
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-8">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="text-main font-medium">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
