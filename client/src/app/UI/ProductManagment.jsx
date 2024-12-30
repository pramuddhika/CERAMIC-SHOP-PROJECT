import { useState } from "react";
import CategoryManagement from "./CategoryManagement";
import SubcategoryManagement from "./SubcategoryManagement";
// import ProductManagementTab from "./ProductManagementTab";

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState(1);

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <CategoryManagement />;
      case 2:
        return <SubcategoryManagement />;
      // case 3:
      //   return <ProductManagementTab />;
      default:
        return <CategoryManagement />;
    }
  };

  return (
    <div>
      <div className="tabs gap-3">
        <button onClick={() => setActiveTab(1)}>Category</button>
        <button onClick={() => setActiveTab(2)}>Subcategory</button>
        <button onClick={() => setActiveTab(3)}>Product</button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default ProductManagement;