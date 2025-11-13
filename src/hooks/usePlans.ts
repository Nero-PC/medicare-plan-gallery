
import { useState, useEffect } from "react";
import initialPlans from "../data/plans.json";

interface Plan {
  id: string;
  carrier: string;
  logo: string;
  name: string;
  rating: number;
  premium: number;
  deductible: number;
  moops: number;
  type: string;
  dentalMax: number;
  vision: number;
  hearing: number;
  fitness: string;
  rebate: boolean;
  noCommission: boolean;
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const storedPlans = localStorage.getItem("plans");
    if (storedPlans) {
      setPlans(JSON.parse(storedPlans));
    } else {
      setPlans(initialPlans);
      localStorage.setItem("plans", JSON.stringify(initialPlans));
    }
  }, []);

  const addPlan = (plan: Plan) => {
    const newPlans = [...plans, plan];
    setPlans(newPlans);
    localStorage.setItem("plans", JSON.stringify(newPlans));
  };

  const updatePlan = (updatedPlan: Plan) => {
    const newPlans = plans.map((plan) =>
      plan.id === updatedPlan.id ? updatedPlan : plan
    );
    setPlans(newPlans);
    localStorage.setItem("plans", JSON.stringify(newPlans));
  };

  const deletePlan = (id: string) => {
    const newPlans = plans.filter((plan) => plan.id !== id);
    setPlans(newPlans);
    localStorage.setItem("plans", JSON.stringify(newPlans));
  };

  return { plans, addPlan, updatePlan, deletePlan };
}
