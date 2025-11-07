import React, { useState, useMemo } from "react";
import {
  Search,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import plans from "./data/plans.json";

export default function App() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    carrier: "All",
    type: "All",
    feature: "All",
  });
  const [compare, setCompare] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  const carriers = ["All", "Aetna", "Humana", "BCBS", "HAP", "Priority", "UHC", "WellCare"];
  const types = ["All", "PPO", "HMO-POS", "R-PPO"];
  const features = ["All", "Rebate", "No Commission"];

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchCarrier = filters.carrier === "All" || plan.carrier === filters.carrier;
      const matchType = filters.type === "All" || plan.type === filters.type;
      const matchFeature =
        filters.feature === "All" ||
        (filters.feature === "Rebate" && plan.rebate) ||
        (filters.feature === "No Commission" && plan.noCommission);
      const matchSearch =
        plan.name.toLowerCase().includes(search.toLowerCase()) ||
        plan.id.toLowerCase().includes(search.toLowerCase());
      return matchCarrier && matchType && matchFeature && matchSearch;
    });
  }, [filters, search]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef)
      scrollRef.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
  };

  const toggleCompare = (id: string) =>
    setCompare((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-4)
    );

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-inter">
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            MyPlanGallery
          </h1>
          <div className="flex gap-2 items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plans..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
            />
          </div>
        </div>
        <div className="bg-gray-100 px-6 py-3 flex gap-3 overflow-x-auto text-sm">
          {[
            ["carrier", carriers],
            ["type", types],
            ["feature", features],
          ].map(([key, list]) => (
            <div key={key as string} className="flex items-center gap-1">
              {(list as string[]).map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, [key as keyof typeof prev]: item }))
                  }
                  className={`px-3 py-1 rounded-full ${
                    filters[key as keyof typeof filters] === item
                      ? "bg-teal-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Showing {filteredPlans.length} Plans
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={setScrollRef}
          className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth"
        >
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="snap-start w-80 flex-shrink-0 border border-gray-200 rounded-2xl bg-white shadow hover:shadow-md transition-all p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <img
                  src={plan.logo}
                  alt={plan.carrier}
                  className="w-20 h-auto object-contain"
                />
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-400" fill="#FFD700" />
                  <span className="text-sm font-medium">{plan.rating}</span>
                </div>
              </div>

              <h3 className="text-base font-semibold">{plan.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{plan.id}</p>

              <div className="grid grid-cols-2 gap-y-1 text-sm mb-3">
                <p>Premium:</p> <p className="font-semibold">${plan.premium}</p>
                <p>Deductible:</p> <p>${plan.deductible}</p>
                <p>MOOP:</p> <p>${plan.moops}</p>
                <p>Type:</p> <p>{plan.type}</p>
              </div>

              <div className="text-sm mb-2 space-y-1">
                <div className="flex items-center gap-1">
                  🦷 <span>Dent: ${plan.dentalMax} Max</span>
                </div>
                <div className="flex items-center gap-1">
                  👓 <span>Vision: ${plan.vision}</span>
                </div>
                <div className="flex items-center gap-1">
                  🦻 <span>Hearing: ${plan.hearing}/ear</span>
                </div>
                <div className="flex items-center gap-1">
                  👟 <span>{plan.fitness}</span>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => toggleCompare(plan.id)}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    compare.includes(plan.id)
                      ? "bg-teal-600 text-white"
                      : "border border-teal-600 text-teal-600"
                  }`}
                >
                  Compare
                </button>
                <button
                  onClick={() => toggleFavorite(plan.id)}
                  className={`p-2 rounded-full ${
                    favorites.includes(plan.id)
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Heart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {compare.length > 0 && (
          <div className="mt-6 border-t border-gray-300 pt-4">
            <h3 className="text-lg font-semibold mb-3">Plan Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-800 font-semibold">
                  <tr>
                    <th className="p-2 text-left">Feature</th>
                    {compare.map((id) => {
                      const plan = plans.find((p) => p.id === id)!;
                      return <th key={id} className="p-2">{plan.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Premium",
                    "Deductible",
                    "MOOP",
                    "Type",
                    "Dental",
                    "Vision",
                    "Hearing",
                    "Fitness",
                  ].map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="p-2 font-medium">{feature}</td>
                      {compare.map((id) => {
                        const plan = plans.find((p) => p.id === id)!;
                        return (
                          <td key={id} className="p-2">
                            {feature === "Premium" && `$${plan.premium}`}
                            {feature === "Deductible" && `$${plan.deductible}`}
                            {feature === "MOOP" && `$${plan.moops}`}
                            {feature === "Type" && plan.type}
                            {feature === "Dental" && `$${plan.dentalMax}`}
                            {feature === "Vision" && `$${plan.vision}`}
                            {feature === "Hearing" && `$${plan.hearing}/ear`}
                            {feature === "Fitness" && plan.fitness}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
