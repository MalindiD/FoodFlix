import React from "react";
import PartnerList from "../components/PartnerList";
import "../style.css";

const PartnerDashboard = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-semibold text-blue mb-6 border-b pb-2">
        Delivery Partner Dashboard
      </h1>
      <PartnerList />
    </div>
  );
};

export default PartnerDashboard;
