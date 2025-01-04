import hero5 from "../assets/hero5.png";
import hero7 from "../assets/hero7.png";
import hero8 from "../assets/hero8.png";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact_us = () => {
  const initialvalues = {
    fullname: "",
    email: "",
    message: "",
  };
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    message: Yup.string().required("Required").max(200, "Message is too long"),
  });
  const onSubmit = async (values, { resetForm, setErrors }) => {
    try {
      // Send the POST request
      const response = await axios.post("/api/contactus/add", {
        fullName: values.fullname,
        email: values.email,
        message: values.message,
      });

      resetForm();
      toast.success(response.data.message || "Message sent successfully!");
    } catch (error) {
      console.error("Failed:", error.response?.data || error.message);

      setErrors({});

      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div id="contact-us">
      <div className="grid sm:grid-cols-2 bg-gray-100 h-full">
        {/* Left Column: Form */}
        <div className="bg-white shadow flex flex-col justify-center p-8 h-full">
          <h2 className="text-4xl font-bold text-main mb-5 text-center">
            CONTACT US
          </h2>
          <Formik
            initialValues={initialvalues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ getFieldProps, touched, errors, handleSubmit }) => (
              <Form>
                <div className="mb-4">
                  <input
                    placeholder="Enter your full name"
                    {...getFieldProps("fullname")}
                    type="text"
                    name="fullname"
                    style={{width: "100%"}}
                    autoComplete="on"
                    className="bg-gray-100 border rounded-lg w-full h-12 p-3"
                  />
                  {touched.fullname && errors.fullname && (
                    <div className="text-red-500 text-sm mt-1 pl-3">
                      {errors.fullname}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    placeholder="Enter your email"
                    {...getFieldProps("email")}
                    type="email"
                    name="email"
                    style={{width: "100%"}}
                    autoComplete="on"
                    className="bg-gray-100 border rounded-lg w-full h-12 p-3"
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-500 text-sm mt-1 pl-3">
                      {errors.email}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <textarea
                    placeholder="Write your message here"
                    {...getFieldProps("message")}
                    name="message"
                    rows="4"
                    style={{width: "100%"}}
                    className="bg-gray-100 border rounded-lg w-full p-3"
                  />
                  {touched.message && errors.message && (
                    <div className="text-red-500 text-sm mt-1 pl-3">
                      {errors.message}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <button
                    type="submit"
                    name="submit"
                    onClick={handleSubmit}
                    style={{width: "100%" ,  backgroundColor: "#6794A0"}}
                    className="text-white rounded-lg w-full h-12 hover:bg-teal-700 transition-all"
                  >
                    Get in Touch
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="bg-white p-4 mt-36 flex items-center justify-between space-y-5">
            <div className="flex items-center justify-center space-x-10">
              <img src={hero7} alt="Phone" className="w-8 h-8" />
              <p className="text-lg">
                +94 710 420 954
                <br />
                dpjayasundara04@gmail.com
              </p>
            </div>

            <div className="flex items-center mt-5 space-x-7 ">
              <img src={hero8} alt="Location" className="w-8 h-8 mr-4" />
              <p className="text-lg">
                GLEAM CERAMIC COMPLEX
                <br />
                No 02, Centre Road,
                <br /> Main Street,
                <br /> Badulla, <br />
                Sri Lanka
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="bg-slate-500 shadow flex items-center justify-center h-full">
          <img
            src={hero5}
            alt="Contact Us"
            className="object-none h-full w-full object-right"
          />
        </div>
      </div>
      <div>
        <footer className="text-white text-center p-2" style={{ backgroundColor: "#6794A0" }}>
          <p>&copy; 2024 Gleam Ceramic. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Contact_us;
