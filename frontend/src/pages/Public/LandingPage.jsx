import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu, Search, ChevronLeft, ChevronRight, MapPin, Utensils, Bike,
} from "lucide-react";
import restaurantService from "../../api/restaurantService";
import LocationPickerModal from "../../components/Shared/LocationPickerModal";

export default function LandingPage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const offerScrollRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState("141/6 Vauxhall St");
  const [searchTerm, setSearchTerm] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const combinedItems = Array.from(new Set([...categories, ...tags]));

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) setLocation(savedLocation);
    fetchRestaurants();
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data || []);
      setError(null);
    } catch (err) {
      setRestaurants([]);
      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term) => {
    try {
      if (term.trim()) {
        const results = await restaurantService.searchRestaurants(term);
        setRestaurants(results || []);
        setSelectedCategory(null);
      } else {
        fetchRestaurants();
      }
    } catch (err) {
      setError("Failed to search restaurants.");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await restaurantService.getUniqueMenuCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await restaurantService.getUniqueTags();
      setTags(data || []);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  };

  const handleCategorySelect = async (category) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
      fetchRestaurants();
    } else {
      setSelectedCategory(category);
      try {
        setLoading(true);
        const data = await restaurantService.filterByCategoryOrTag(category);
        setRestaurants(data || []);
        setError(null);
      } catch (err) {
        setRestaurants([]);
        setError("Failed to load filtered restaurants.");
      } finally {
        setLoading(false);
      }
    }
  };

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  const scrollOfferLeft = () => offerScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollOfferRight = () => offerScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  const categoryIconMap = {
    'Main Course': '🍽️', 'BBQ': '🍖', 'Bakery': '🥐', 'Beef': '🥩', 'Bubble Tea': '🧋',
    'Burgers': '🍔', 'Cheese': '🧀', 'Chicken': '🍗', 'Chinese': '🥡', 'Donuts': '🍩',
    'Fish': '🐟', 'Korean': '🍲', 'Lasagna': '🍛', 'Lasagne': '🍛', 'Macaroni': '🍝',
    'Mexican': '🌮', 'Mozzarella': '🧀', 'Non-veg': '🥩', 'Pan Crust': '🍕', 'Pasta': '🍝',
    'Seafood': '🦞', 'Pizza': '🍕', 'Rice': '🍚', Sushi: '🍣', Spaghetti: '🍝',
    Noodles: '🍜', Soup: '🥣', Veg: '🥦', Spicy: '🌶️', Salad: '🥬', Wraps: '🌯',
  };

  const offers = [
    { title: "40% Off for New Users", desc: "Valid on your first 2 orders above Rs. 1,000", img: "/images/pizza.jpg", cta: "Use Code: UBERSSL" },
    { title: "65% Off with Commercial Bank", desc: "Valid for first 2 orders until 30 April", img: "/images/kfc.jpg", cta: "Use Code: CB650" }
  ];

  return (
    <div className="min-h-screen bg-[#f0f1f5] text-[#333]">
      <header className="bg-white shadow-md px-4 py-2 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}><Menu className="h-6 w-6 text-[#ec5834]" /></button>
          <h1 className="text-xl font-bold text-[#ec5834]">FoodFlix</h1>
        </div>
        <div className="hidden md:flex items-center gap-1 text-sm text-gray-600 cursor-pointer" onClick={() => setModalOpen(true)}>
          <MapPin className="h-4 w-4" />
          <span>{location} • Now ▼</span>
        </div>
        <div className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm text-gray-600 w-48 sm:w-64">
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          <input
            type="text"
            placeholder="Search FoodFlix"
            className="bg-transparent outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/login")} className="text-sm text-gray-700 hover:text-[#ec5834] font-medium">Log in</button>
          <button onClick={() => navigate("/register")} className="bg-[#ec5834] text-white px-4 py-1 rounded-full text-sm hover:bg-[#d94c2d]">Sign up</button>
        </div>
      </header>

      <LocationPickerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(newLoc) => {
          setLocation(newLoc);
          localStorage.setItem("userLocation", newLoc);
          setModalOpen(false);
        }}
      />

      {/* Filters */}
      <section className="relative px-4 py-4">
        <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronLeft className="h-5 w-5 text-[#ec5834]" />
        </button>
        <div ref={scrollRef} className="overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-4 px-6">
          {combinedItems.map((cat) => (
            <div
              key={cat}
              className={`flex flex-col items-center text-sm min-w-fit cursor-pointer ${selectedCategory === cat ? "text-[#ec5834] font-bold" : "text-gray-700"}`}
              onClick={() => handleCategorySelect(cat)}
            >
              <div className="text-2xl">{categoryIconMap[cat] || "🍽️"}</div>
              <span>{cat}</span>
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronRight className="h-5 w-5 text-[#ec5834]" />
        </button>
      </section>

      {/* Offers */}
      <section className="relative px-4 pb-8">
        <button onClick={scrollOfferLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronLeft className="h-5 w-5 text-[#ec5834]" />
        </button>
        <div ref={offerScrollRef} className="flex overflow-x-auto space-x-4 px-8 scrollbar-hide">
          {offers.map((offer, index) => (
            <div key={index} className="min-w-[350px] max-w-[350px] bg-white border rounded-xl shadow-md flex p-4 items-center">
              <div className="flex-1 pr-4">
                <h4 className="font-bold text-base text-gray-800">{offer.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{offer.desc}</p>
                <button className="mt-4 bg-[#ec5834] text-white font-semibold px-6 py-2 rounded-full w-full hover:bg-[#d94c2d] transition">{offer.cta}</button>
              </div>
              <img src={offer.img} alt={offer.title} className="h-24 w-24 object-cover rounded-lg" />
            </div>
          ))}
        </div>
        <button onClick={scrollOfferRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronRight className="h-5 w-5 text-[#ec5834]" />
        </button>
      </section>

      {/* Restaurants */}
      <section className="px-4 pb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All Stores</h3>
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((store, index) => (
              <div
                key={store._id || index}
                onClick={() => navigate(`/restaurant/${store._id}`)}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 cursor-pointer"
              >
                <img src={store.profileImage || "/images/restaurant-placeholder.jpg"} alt={store.name} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800">{store.name}</h4>
                  <p className="text-sm text-gray-500">{store.cuisineType || "Cuisine"} • {store.openingHours || "Open hours"}</p>
                  <p className="text-xs text-gray-500 mt-1">{store.address || "No address provided"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setSidebarOpen(false)} />
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50">
            <div className="p-5 flex flex-col gap-6 text-sm text-gray-900">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Welcome</h2>
                <button onClick={() => setSidebarOpen(false)} className="text-lg text-gray-500 font-bold">×</button>
              </div>
              <button onClick={() => { navigate("/register"); setSidebarOpen(false); }} className="w-full bg-black text-white py-2 rounded-lg font-semibold">Sign up</button>
              <button onClick={() => { navigate("/login"); setSidebarOpen(false); }} className="w-full border border-gray-300 py-2 rounded-lg">Log in</button>
              <div className="mt-2 space-y-3">
                <p className="hover:text-[#ec5834] cursor-pointer flex items-center gap-2"><Utensils className="h-4 w-4" /> Add your restaurant</p>
                <p className="hover:text-[#ec5834] cursor-pointer flex items-center gap-2"><Bike className="h-4 w-4" /> Sign up to deliver</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
