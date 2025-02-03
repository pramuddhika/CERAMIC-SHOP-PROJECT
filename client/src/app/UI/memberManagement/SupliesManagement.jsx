// To do: Create a UI for the Supplies Management page , can addd , in edit can deactivate and activate the supplier
import { useState } from "react";

const SuplierManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = async () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <>
      <div className="card rounded-lg h-full w-full">
        <div className="card-header flex justify-between items-center border-b py-2 bg-gray-100">
          <div>
            <h2 className="text-lg font-semibold">Supplier Management</h2>
          </div>
          <button
            className="text-white bg-cyan-950 hover:bg-cyan-900 px-3 py-1 gap-2 rounded-lg flex items-center"
            onClick={handleModalToggle}
          >
            <i className="bi bi-person-plus"></i>
            Add New
          </button>
        </div>

        <div className="card-body overflow-auto flex justify-center">
          <table className="border text-sm table-fixed w-full overflow-auto">
            <thead className="bg-slate-400">
              <tr className="pl-2 text-center">
                <th className="border py-2 min-w-[200px]">ID</th>
                <th className="border py-2 min-w-[280px]">Name</th>
                <th className="border py-2 min-w-[200px]">Email</th>
                <th className="border py-2 min-w-[200px]">Phone</th>
                <th className="border py-2 min-w-[200px]">City</th>
                <th className="border py-2 min-w-[200px]">Status</th>
                <th className="border py-2 min-w-[200px]">
                  <div className="flex justify-center">Actions</div>
                </th>
              </tr>
            </thead>
            {/* <tbody className="divide-y">
                          {currentData.message === "No data found!" ||
                          currentData.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-4">
                                <img
                                  src={Nodata}
                                  style={{
                                    width: "150px",
                                    margin: "0 auto",
                                    padding: "20px",
                                  }}
                                />
                                <span className="text-gray-500">No Data Available</span>
                              </td>
                            </tr>
                          ) : (
                            Array.isArray(currentData) &&
                            currentData.map((row, index) => (
                              <tr key={index}>
                                <td className="border px-6 py-2 text-center">
                                  {row.MATERIAL_ID}
                                </td>
                                <td className="border px-6 py-2 text-center">{row.NAME}</td>
                                <td className="border px-6 py-2">{row.DESCRIPTION}</td>
                                {row.STATUS === 1 ? (
                                  <td className="border px-6 text-center">
                                    <span className="text-white bg-green-600 py-2 px-4 rounded-2xl">
                                      Active
                                    </span>
                                  </td>
                                ) : (
                                  <td className="border px-6 py-2 text-center">
                                    <span className="text-white bg-red-600 py-2  px-4 rounded-2xl">
                                      Inactive
                                    </span>
                                  </td>
                                )}
                                <td className="border px-6 py-4 flex justify-center items-center">
                                  <button
                                    className="text-slate-500 hover:text-slate-800 border-none"
                                    // onClick={() => handleEdit(row)}
                                  >
                                    {/* <FaEdit /> 
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody> */}
          </table>
        </div>
        {/* <CommonPagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPageChange={handlePageChange}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    /> */}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ width: "400px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Supplier</h2>
              <button
                className="text-slate-600 hover:text-main"
                onClick={() => {
                  handleModalToggle();
                }}
              >
                ✖
              </button>
            </div>
            <div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuplierManagement;
