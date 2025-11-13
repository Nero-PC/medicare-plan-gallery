
import React from "react";
import { usePlans } from "../hooks/usePlans";

export function DataLog() {
  const { plans, addPlan, updatePlan, deletePlan } = usePlans();

  const handleAddPlan = () => {
    // This is a placeholder for a more complete "add plan" form
    const newPlan = {
      id: `new-${Date.now()}`,
      carrier: "New Carrier",
      logo: "/logos/default.png",
      name: "New Plan Name",
      rating: 4.0,
      premium: 100,
      deductible: 500,
      moops: 5000,
      type: "PPO",
      dentalMax: 1000,
      vision: 200,
      hearing: 500,
      fitness: "SilverSneakers",
      rebate: false,
      noCommission: false,
    };
    addPlan(newPlan);
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Data Log</h2>
      <button
        onClick={handleAddPlan}
        className="bg-accent-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Add New Plan
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Carrier</th>
              <th className="p-2">Premium</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b">
                <td className="p-2">{plan.name}</td>
                <td className="p-2">{plan.carrier}</td>
                <td className="p-2">${plan.premium}</td>
                <td className="p-2">
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
