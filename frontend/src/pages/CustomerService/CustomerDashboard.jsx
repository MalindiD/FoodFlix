import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../../components/Shared/Navbar';
import restaurantService from '../../api/restaurantService';

export default function CustomerDashboard() {
  const scrollRef = useRef(null);
  const offerScrollRef = useRef(null);

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Icon mapping with fallback
  const categoryIconMap = {
    Pizza: '🍕',
    Bakery: '🥐',
    Burgers: '🍔',
    'Bubble Tea': '🧋',
    'Fried Chicken': '🍗',
    Noodles: '🍜',
    Drinks: '🥤',
    'Ice Cream': '🍦',
    Coffee: '☕',
    Chinese: '🥡',
    Snacks: '🍪',
    Indian: '🍛',
    Soup: '🥣',
    Korean: '🍲',
    Sushi: '🍣',
    'Fast Food': '🍟',
    Mexican: '🌮',
    'Hot Dog': '🌭',
    BBQ: '🍖',
    Donuts: '🍩',
    Seafood: '🦞',
    Salads: '🥬',
    Vegan: '🥒',
    Wraps: '🌯'
  };

  useEffect(() => {
    fetchRestaurants();
    fetchCategories(); // 👈 Load unique categories
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchRestaurantsByCategory(selectedCategory);
    } else {
      fetchRestaurants();
    }
  }, [selectedCategory]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data || []);
      setError(null);
    } catch (err) {
      setRestaurants([]);
      setError('Failed to load restaurants.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantsByCategory = async (category) => {
    try {
      setLoading(true);
      const data = await restaurantService.filterByCategory(category);
      setRestaurants(data || []);
      setError(null);
    } catch (err) {
      setRestaurants([]);
      setError('Failed to load filtered restaurants.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await restaurantService.getUniqueMenuCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  const scrollOfferLeft = () => offerScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollOfferRight = () => offerScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  const filters = ['Offers', 'Delivery fee', 'Under 30 min', 'Highest rated', 'Rating', 'Price', 'Sort'];

  const offers = [
    {
      title: '40% Off for New Users*',
      desc: 'Valid on your first 2 orders above Rs. 1,000',
      img: '/images/pizza.jpg',
      cta: 'Use Code: UBERSSL'
    },
    {
      title: '65% Off with Commercial Bank',
      desc: 'Valid for the first 2 orders until 30 April',
      img: '/images/kfc.jpg',
      cta: 'Use Code: CB650'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0f1f5] text-[#333]">
      <Navbar />

      {/* Categories */}
      <section className="relative px-4 py-4">
        <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronLeft className="h-5 w-5 text-[#ec5834]" />
        </button>
        <div ref={scrollRef} className="overflow-x-auto whitespace-nowrap scrollbar-hide flex space-x-4 px-6">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`flex flex-col items-center text-sm min-w-fit cursor-pointer ${
                selectedCategory === cat ? 'text-[#ec5834] font-bold' : 'text-gray-700'
              }`}
              onClick={() => handleCategorySelect(cat)}
            >
              <div className="text-2xl">{categoryIconMap[cat] || '🍽️'}</div>
              <span>{cat}</span>
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronRight className="h-5 w-5 text-[#ec5834]" />
        </button>
      </section>

      {/* Filters */}
      <section className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, i) => (
            <button key={i} className="bg-white px-4 py-1 rounded-full text-sm border hover:border-[#ec5834] hover:text-[#ec5834]">
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section className="relative px-4 pb-8">
        <button onClick={scrollOfferLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronLeft className="h-5 w-5 text-[#ec5834]" />
        </button>
        <div ref={offerScrollRef} className="flex overflow-x-auto space-x-4 px-8 scrollbar-hide">
          {offers.map((offer, index) => (
            <div key={index} className="min-w-[350px] max-w-[350px] bg-white border border-gray-200 rounded-xl shadow-md flex p-4 items-center">
              <div className="flex-1 pr-4">
                <h4 className="font-bold text-base text-gray-800">{offer.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{offer.desc}</p>
                <button className="mt-4 bg-[#ec5834] text-white font-semibold px-6 py-2 rounded-full w-full hover:bg-[#d94c2d] transition">
                  {offer.cta}
                </button>
              </div>
              <img src={offer.img} alt={offer.title} className="h-24 w-24 object-cover rounded-lg" />
            </div>
          ))}
        </div>
        <button onClick={scrollOfferRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-1">
          <ChevronRight className="h-5 w-5 text-[#ec5834]" />
        </button>
      </section>

      {/* All Stores */}
      <section className="px-4 pb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">All Stores</h3>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec5834]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((store, index) => (
              <div
                key={store._id || index}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 cursor-pointer"
              >
                <img
                  src={store.profileImage || '/images/restaurant-placeholder.jpg'}
                  alt={store.name}
                  className="h-40 w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/restaurant-placeholder.jpg';
                  }}
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800">{store.name}</h4>
                  <p className="text-sm text-gray-500">
                    {store.cuisineType || 'Cuisine'} • {store.openingHours || 'Open hours'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {store.address || 'No address provided'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
