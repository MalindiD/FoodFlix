import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftCircle,
  Plus,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import Navbar from '../../components/Shared/Navbar';
import restaurantService from '../../api/restaurantService';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [filters, setFilters] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await restaurantService.getRestaurantById(id);
        const menuData = await restaurantService.getMenuItems(id);
        setRestaurant(resData);
        setMenuItems(menuData);
        setFilteredItems(menuData);

        const categories = new Set(menuData.map(item => item.category));
        const tags = menuData.flatMap(item => item.tags || []);
        const allFilters = Array.from(new Set([...categories, ...tags]));
        setFilters(['All', ...allFilters]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let items = menuItems;
    if (selectedFilter !== 'All') {
      items = items.filter(
        item =>
          item.category === selectedFilter ||
          (item.tags && item.tags.includes(selectedFilter))
      );
    }
    if (search.trim() !== '') {
      items = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredItems(items);
  }, [selectedFilter, search, menuItems]);

  const scrollLeft = () => scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#f0f1f5]">
      <Navbar />

      {/* Restaurant Image with White Back Icon */}
      <div className="relative">
        <img
          src={restaurant?.profileImage || '/images/restaurant-placeholder.jpg'}
          alt={restaurant?.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-4 left-4 z-10">
          <Link to="/dashboard" className="rounded-full p-1">
            <ArrowLeftCircle className="w-9 h-9 text-white hover:text-[#ec5834] transition" />
          </Link>
        </div>
      </div>

      {/* Restaurant Info & Search */}
      <div className="p-4 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{restaurant?.name}</h1>
          <p className="text-sm text-gray-600">{restaurant?.address}</p>
          <p className="text-sm text-gray-500">{restaurant?.openingHours}</p>
        </div>
        <div className="w-full sm:w-96 bg-gray-100 flex items-center px-3 py-2 rounded-full">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>
      </div>

      {/* Horizontal Scrollable Filters */}
      <div className="relative px-4 bg-white py-3 overflow-hidden">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1"
        >
          <ChevronLeft className="text-[#ec5834]" />
        </button>

        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-8">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFilter(filter)}
              className={`whitespace-nowrap px-4 py-1 rounded-full border text-sm transition ${
                selectedFilter === filter
                  ? 'bg-[#ec5834] text-white'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1"
        >
          <ChevronRight className="text-[#ec5834]" />
        </button>
      </div>

      {/* Menu Items */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item._id} className="bg-white rounded-xl shadow hover:shadow-lg">
            <img
              src={item.image || '/images/food-placeholder.jpg'}
              alt={item.name}
              className="w-full h-40 object-cover rounded-t-xl"
              onError={(e) => (e.target.src = '/images/food-placeholder.jpg')}
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-sm text-gray-600 h-12 overflow-hidden">{item.description}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-md font-bold text-gray-800">Rs. {item.price}</span>
                <button
                  className="bg-[#ec5834] text-white px-3 py-1 rounded-full hover:bg-[#d94c2d] transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
