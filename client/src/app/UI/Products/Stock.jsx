import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import Nodata from "../../../assets/Nodata.svg";
import CommonLoading from "../../../utils/CommonLoading";
import jsPDF from "jspdf";

const Stock = () => {
  const [ProductstockData, setProductstockData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchproductstockData = async (query = "") => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/productcreationdata/get/product${query ? `?search=${query}` : ""}`
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

  const handlePrint = () => {
    const pdf = new jsPDF();
    const today = moment().format('YYYY-MM-DD');

    // Add title
    pdf.setFontSize(18);
    pdf.text('GLEAM CERAMIC', pdf.internal.pageSize.getWidth() / 2, 10, { align: 'center' });

    // Add date and report type
    pdf.setFontSize(12);
    pdf.text(`Date: ${today}`, 10, 20);
    pdf.text('Report: Product Stock', pdf.internal.pageSize.getWidth() - 10, 20, { align: 'right' });

    // Add table
    pdf.autoTable({
      startY: 30,
      head: [['ID', 'Material Name', 'Last Update', 'Quantity(units)']],
      body: ProductstockData.map(item => [
        item.PRODUCT_CODE,
        item.NAME,
        moment(item.UPDATE_DATE).format('YYYY-MM-DD'),
        item.QUANTITY.toString()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [60, 141, 188] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    // Save the PDF
    pdf.save("product_stock.pdf");
  }

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      fetchproductstockData(searchQuery);
    }
  }

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      fetchproductstockData();
    }
  }

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
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleSearch}
              ref={searchInputRef}
              className="border border-gray-300 rounded-lg px-3 py-1 mr-2"
              style={{ outline: "none" }}
            />
            <button
              className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 rounded-lg flex items-center ml-2"
              onClick={handlePrint}
            >
              Print
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
                <th className="border py-2 min-w-[300px]">Product Code</th>
                <th className="border py-2 min-w-[300px]">Product Name</th>
                <th className="border py-2 min-w-[200px]">Last Update Date</th>
                <th className="border py-2 min-w-[300px]">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {ProductstockData?.length > 0 ? (
                ProductstockData?.map((item) => (
                  <tr key={item.PRODUCT_CODE} className="text-center">
                    <td className="border py-2">{item.PRODUCT_CODE}</td>
                    <td className="border py-2">{item.NAME}</td>
                    <td className="border py-2">
                      {moment(item.UPDATE_DATE).format("YYYY-MM-DD")}
                    </td>
                    <td className="border py-2">{item.QUANTITY}</td>
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
