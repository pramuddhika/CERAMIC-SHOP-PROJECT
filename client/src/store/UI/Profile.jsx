import { useState } from "react";

const Profile = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("User"));

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const PersonalInformation = () => {
    return (
      <div className="flex">
        <div className="col-6">
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <p className="text-lg font-semibold">
            {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
        <div className="col-6">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="text-lg font-semibold">{currentUser.email}</p>
        </div>
      </div>
    );
  };

  const Settings = () => {
    return <p>password change here</p>;
  };

  const accordionData = [
    {
      title: "Personal Information",
      content: PersonalInformation(),
    },
    {
      title: "Address Book",
      content: "View your past orders and purchase history.",
    },
    {
      title: "To Pay",
      content: "View your past orders and purchase history.",
    },
    {
      title: "To Ship",
      content: "View your past orders and purchase history.",
    },
    {
      title: "Order History",
      content: "View your past orders and purchase history.",
    },
    {
      title: "Settings",
      content: Settings(),
    },
  ];

  return (
    <div className="max-w-full mx-auto p-4 space-y-4">
      {accordionData.map((item, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleAccordion(index)}
            className="flex  items-center p-4 bg-white hover:bg-gray-50 transition-colors duration-200 min-w-full"
          >
            <div className="flex justify-between items-center m-2 min-w-full">
              <div>
                <span className="font-medium text-lg">{item.title}</span>
              </div>
              <div>
                <svg
                  className={`w-6 h-6 transform transition-transform duration-200 ${
                    openAccordion === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </button>
          <div
            className={`transition-all duration-200 ease-in-out ${
              openAccordion === index
                ? "max-h-40 opacity-100"
                : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="p-4 bg-gray-50">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
