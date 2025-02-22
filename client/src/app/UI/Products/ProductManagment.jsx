import { useState } from "react";
import CategoryManagement from "./CategoryManagement";
import SubcategoryManagement from "./SubcategoryManagement";
import ProductManagementTab from "./ProductManagementTab.jsx";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState(1);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <CategoryManagement />;
      case 2:
        return <SubcategoryManagement />;
      case 3:
        return <ProductManagementTab />;
      default:
        return <CategoryManagement />;
    }
  };

  return (
    <div>
      <div className="tabs flex">
        <button
          className={`px-2 py-1 rounded ${activeTab === 1 ? "font-bold underline" : ""}`}
          onClick={() => setActiveTab(1)}
        >
          Category
        </button>
        <button
          className={`px-2 py-1 rounded ${activeTab === 2 ? "font-bold underline" : ""}`}
          onClick={() => setActiveTab(2)}
        >
          Subcategory
        </button>
        <button
          className={`px-2 py-1 rounded ${activeTab === 3 ? "font-bold underline" : ""}`}
          onClick={() => setActiveTab(3)}
        >
          Product
        </button>
      </div>
      <div className="tab-content mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default ProductManagement;