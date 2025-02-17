import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [meterialList, setMaterialList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);

  const fetchMaterialListData = async () => {
    try {
      const response = await axios.get('/api/materialdata/get/list');
      setMaterialList(response?.data);
    } catch (error) { 
      console.log(error);
    }
  }

  const fetchSupplierListData = async () => {
    try {
      const response = await axios.get('/api/auth/getSupplierList');
      setSupplierList(response?.data);
    } catch (error) { 
      console.log(error);
    }
  }

  const options = meterialList.map(item => ({
    value: item.MATERIAL_ID,
    label: item.NAME
  }));

  const supplierOptions = supplierList.map(item => ({
    value: item.USER_ID,
    label: item.FIRST_NAME + ' ' + item.LAST_NAME
  }));

  useEffect(() => {
    fetchMaterialListData();
    fetchSupplierListData();
  }, []);

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
          const receivedObj={
            materialId: values?.material?.value,
            supplierId: values?.supplier?.value,
            date: values?.date,
            quantity: values?.quantity,
            value: values?.value
          }
          console.log(receivedObj);
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
