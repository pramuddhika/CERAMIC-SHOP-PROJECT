import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";

const options = [
  { value: "ceramic", label: "Ceramic" },
  { value: "porcelain", label: "Porcelain" },
  { value: "clay", label: "Clay" },
];

const supplierOptions = [
  { value: "supplier1", label: "Supplier 1" },
  { value: "supplier2", label: "Supplier 2" },
  { value: "supplier3", label: "Supplier 3" },
];

const validationSchema = Yup.object({
  material: Yup.object().required("required"),
  supplier: Yup.object().required("required"),
  value: Yup.number().required("required").positive("must be greater than 0"),
  quantity: Yup.number()
    .required("required")
    .positive("must be greater than 0"),
  date: Yup.date().required("required"),
});

const Received = () => {
  return (
    <>
      <Formik
        initialValues={{
          material: "",
          supplier: "",
          value: "",
          quantity: "",
          date: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="row g-3 p-3 border rounded">
            <div className="col-md-2">
              <label className="form-label">Material</label>
              <Select
                options={options}
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
              <label className="form-label">Supplier</label>
              <Select
                options={supplierOptions}
                onChange={(option) => setFieldValue("supplier", option)}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
              <ErrorMessage
                name="supplier"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Value (Rs.)</label>
              <Field
                type="number"
                name="value"
                className="form-control"
                style={{
                  boxShadow: "none",
                  borderColor: "#ced4da",
                  outline: "none",
                }}
              />
              <ErrorMessage
                name="value"
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
     
    </>
  );
};

export default Received;
