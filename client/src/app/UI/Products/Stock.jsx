import { useEffect, useState } from "react";
import axios from "axios";

import moment from "moment";
import Nodata from "../../../assets/Nodata.svg";
import CommonLoading from "../../../utils/CommonLoading";

const Stock = () => {
  const [ProductstockData, setProductstockData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchproductstockData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/productcreationdata/get/product`
      );
      setProductstockData(response?.data?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchproductstockData();
  }, []);

  return (
    <>
      <div className="card rounded-lg w-full mt-2">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Product Stock</h2>
          </div>
        </div>

        <div className="card-body overflow-auto flex justify-center">
          <table
            id="stock-table"
            className="border text-sm table-fixed w-full overflow-auto"
          >
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[300px]">Product Name</th>
                <th className="border py-2 min-w-[300px]">Quantity</th>
                <th className="border py-2 min-w-[150px]">Created Date</th>
              </tr>
            </thead>
            <tbody>
              {ProductstockData?.length > 0 ? (
                ProductstockData?.map((item) => (
                  <tr key={item.PRODUCT_CODE} className="text-center">
                    <td className="border py-2">{item.NAME}</td>
                    <td className="border py-2">{item.QUANTITY}</td>
                    <td className="border py-2">
                      {moment(item.UPDATE_DATE).format("YYYY-MM-DD")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <img
                      src={Nodata}
                      alt="No data"
                      className="w-32 h-52 mx-auto"
                    />
                    <p className="text-lg text-gray-500">No data found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isLoading && <CommonLoading />}
    </>
  );
};

export default Stock;
