import React from "react";
import hero5 from "../assets/hero5.png";
import hero7 from "../assets/hero7.png";
import hero8 from "../assets/hero8.png";

import { Formik, Form } from "formik";
import * as Yup from "yup";

const Contact_us = () => {
  const initialvalues = {
    fullname: "",
    email: "",
    message: "",
  };

  const onSubmit = (values, { resetForm }) => {
    console.log("Form data:", values);
    alert("Your message has been sent!");
    resetForm();
  };

  return (
    <div id="contact-us">
      <div className="grid sm:grid-cols-2 bg-gray-100 h-full">
        {/* Left Column: Form */}
        <div className="bg-white shadow flex flex-col justify-center p-8 h-full">
          <h2 className="text-4xl font-bold text-teal-600 mb-5 text-center">
            CONTACT US
          </h2>
          <Formik initialValues={initialvalues} onSubmit={onSubmit}>
            {({ getFieldProps, touched, errors }) => (
              <Form>
                <div className="mb-4">
                  <input
                    placeholder="Enter your full name"
                    {...getFieldProps("fullname")}
                    type="text"
                    name="fullname"
                    autoComplete="on"
                    className="bg-gray-100 border rounded-lg w-full h-12 p-3"
                  />
                  {touched.fullname && errors.fullname && (
                    <div className="text-red-500 text-sm mt-1">
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
                    autoComplete="on"
                    className="bg-gray-100 border rounded-lg w-full h-12 p-3"
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-500 text-sm mt-1">
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
                    className="bg-gray-100 border rounded-lg w-full p-3"
                  />
                  {touched.message && errors.message && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <button
                    type="submit"
                    className="bg-teal-600 text-white rounded-lg w-full h-12 hover:bg-teal-700 transition-all"
                  >
                    Get in Touch
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="bg-white p-8 mt-10">
            <div className="flex items-center space-x-10">
              <img src={hero7} alt="Phone" className="w-8 h-8 mr-4" />
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
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact_us;