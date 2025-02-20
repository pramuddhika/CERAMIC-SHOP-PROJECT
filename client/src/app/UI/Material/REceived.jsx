import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

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
      const response = await axios.get("/api/materialdata/get/list");
      setMaterialList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSupplierListData = async () => {
    try {
      const response = await axios.get("/api/auth/getSupplierList");
      setSupplierList(response?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const options = meterialList.map((item) => ({
    value: item.MATERIAL_ID,
    label: item.NAME,
  }));

  const supplierOptions = supplierList.map((item) => ({
    value: item.USER_ID,
    label: item.FIRST_NAME + " " + item.LAST_NAME,
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
        onSubmit={async (values, { resetForm, setFieldValue }) => {
          const receivedObj = {
            materialId: values?.material?.value,
            supplierId: values?.supplier?.value,
            date: values?.date,
            quantity: values?.quantity,
            value: values?.value,
          };
          try {
            const response = await axios.post(
              "/api/materialdata/add/received",
              receivedObj
            );
            toast.success(response?.data?.message);

            resetForm();
            setTimeout(() => {
              setFieldValue("material", null);
              setFieldValue("supplier", null);
            }, 0);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="row g-3 p-3 border rounded">
            <div className="col-md-2">
              <label className="form-label">Material</label>
              <Select
                options={options}
                value={values.material}
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
                value={values.supplier}
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
                max={moment().format("YYYY-MM-DD")}
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

      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Material Received Note</h2>
          </div>
          <div className="flex items-center">
            <button className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center ml-2">
             <i className="bi bi-funnel"></i>
            </button>
          </div>
        </div>

        <div className="card-body overflow-auto flex justify-center">
          <table
            id="stock-table"
            className="border text-sm table-fixed w-full overflow-auto"
          >
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[300px]">Material Name</th>
                <th className="border py-2 min-w-[300px]">Supplier</th>
                <th className="border py-2 min-w-[150px]">Quality</th>
                <th className="border py-2 min-w-[300px]">Date</th>
                <th className="border py-2 min-w-[300px]">Quantity(Kg)</th>
                <th className="border py-2 min-w-[100px]">Action</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </>
  );
};

export default Received;
