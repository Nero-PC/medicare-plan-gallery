
import React, { useState, useMemo } from "react";
import {
  Search,
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  Database,
} from "lucide-react";
import { usePlans } from "./hooks/usePlans";
import { DataLog } from "./components/DataLog";

export default function App() {
  const { plans } = usePlans();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    carrier: "All",
    type: "All",
    feature: "All",
  });
  const [compare, setCompare] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const [showDataLog, setShowDataLog] = useState(false);

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
  }, [filters, search, plans]);

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

  const comparedPlans = useMemo(() => {
    return plans.filter((plan) => compare.includes(plan.id));
  }, [compare, plans]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            MyPlanGallery
          </h1>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plans..."
                className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
            <button
              onClick={() => setShowDataLog(!showDataLog)}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Database size={18} />
            </button>
          </div>
        </div>
        <div className="bg-gray-100/50 px-6 py-3 flex gap-3 overflow-x-auto text-sm">
          {[
            ["carrier", carriers],
            ["type", types],
            ["feature", features],
          ].map(([key, list]) => (
            <div key={key as string} className="flex items-center gap-2">
              <span className="font-medium text-gray-600 capitalize">{key}:</span>
              {(list as string[]).map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, [key as keyof typeof prev]: item }))
                  }
                  className={`px-3 py-1 rounded-full transition-colors ${
                    filters[key as keyof typeof filters] === item
                      ? "bg-accent-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {showDataLog ? (
          <DataLog />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Showing {filteredPlans.length} of {plans.length} Plans
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scroll("left")}
                  className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div
              ref={setScrollRef}
              className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth"
            >
              {filteredPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="snap-start w-80 flex-shrink-0 border border-gray-200 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all p-5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <img
                      src={plan.logo}
                      alt={plan.carrier}
                      className="w-24 h-auto object-contain"
                    />
                    <div className="flex items-center gap-1">
                      <Star size={18} className="text-yellow-400" fill="#FFD700" />
                      <span className="text-sm font-semibold">{plan.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{plan.id}</p>

                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                    <div><p className="text-gray-500">Premium:</p> <p className="font-semibold text-lg">${plan.premium}</p></div>
                    <div><p className="text-gray-500">Deductible:</p> <p className="font-semibold text-lg">${plan.deductible}</p></div>
                    <div><p className="text-gray-500">MOOP:</p> <p className="font-semibold text-lg">${plan.moops}</p></div>
                    <div><p className="text-gray-500">Type:</p> <p className="font-semibold">{plan.type}</p></div>
                  </div>

                  <div className="text-sm mb-4 space-y-2 border-t border-gray-200 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🦷</span> <span>Dental: ${plan.dentalMax} Max</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👓</span> <span>Vision: ${plan.vision}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🦻</span> <span>Hearing: ${plan.hearing}/ear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👟</span> <span>Fitness: {plan.fitness}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => toggleCompare(plan.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
                        compare.includes(plan.id)
                          ? "bg-accent-500 text-white"
                          : "border border-accent-500 text-accent-500 hover:bg-accent-500/10"
                      }`}
                    >
                      {compare.includes(plan.id) ? "Selected for Compare" : "Compare"}
                    </button>
                    <button
                      onClick={() => toggleFavorite(plan.id)}
                      className={`p-2 rounded-full transition-colors ml-2 ${
                        favorites.includes(plan.id)
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {compare.length > 0 && !showDataLog && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Comparing {compare.length} Plans
              </h3>
              <button
                onClick={() => setCompare([])}
                className="text-sm text-gray-600 hover:text-accent-500 flex items-center gap-1"
              >
                <X size={16} /> Clear All
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {comparedPlans.map((plan) => (
                <div key={plan.id} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-sm text-gray-500">${plan.premium}/mo</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
