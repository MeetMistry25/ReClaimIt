import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  CalendarIcon,
  MapPinIcon,
  TagIcon
} from '@heroicons/react/24/outline';

const LostItemsDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    placeLost: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'Electronics',
    'Documents',
    'Clothing',
    'Accessories',
    'Books',
    'Keys',
    'ID Cards',
    'Wallets',
    'Others'
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'claimed', label: 'Claimed', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-blue-100 text-blue-800' }
  ];

  const categoryBackgrounds = {
    'Electronics': '/assets/electronics.jpg',
    'Books': '/assets/books.jpeg',
    'Clothing': '/assets/clothing.jpg',
    'Accessories': '/assets/accessories.jpeg',
    'Keys': '/assets/keys.jpg',
    'Documents': '/assets/document.jpg',
    'ID Cards': '/assets/ids.jpg',
    'Wallets': '/assets/wallet.jpg',
    'Others': '/assets/others.jpg',
  };

  useEffect(() => {
    fetchLostItems();
  }, [filters]);

  const fetchLostItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/items/lost?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching lost items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      placeLost: '',
      dateFrom: '',
      dateTo: '',
      status: ''
    });
    setSearchQuery('');
  };

  const filteredItems = items.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.placeLost.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusInfo = statuses.find(s => s.value === status);
    return statusInfo ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    ) : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-100 mb-2">Lost Items</h1>
        <p className="text-gray-600 dark:text-gray-300">Browse and search for lost items reported by students</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100 dark:hover:bg-gray-800"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="form-label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  placeholder="Search by location..."
                  value={filters.placeLost}
                  onChange={(e) => handleFilterChange('placeLost', e.target.value)}
                  className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
                />
              </div>

              <div>
                <label className="form-label">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
                />
              </div>

              <div>
                <label className="form-label">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-primary-100"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 dark:text-gray-300">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-primary-100 mb-2">No items found</h3>
          <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="card hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              {/* Item Image */}
              <div
                className="aspect-w-16 aspect-h-9 mb-4 bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-900 relative"
                style={!item.imageUrl && item.category && categoryBackgrounds[item.category] ? {
                  backgroundImage: `url(${categoryBackgrounds[item.category]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : {}}
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-48 object-cover dark:bg-gray-900"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-opacity-60" style={{background: 'rgba(0,0,0,0.3)'}}>
                    <TagIcon className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-primary-100 line-clamp-2">
                    {item.itemName}
                  </h3>
                  {getStatusBadge(item.status)}
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                  {item.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-4 w-4" />
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span className="line-clamp-1">{item.placeLost}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Lost on {formatDate(item.dateLost)}</span>
                  </div>
                  {item.userId && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">Reported by: {item.userId.name}</span>
                    </div>
                  )}
                </div>

                <Link
                  to={`/item/lost/${item._id}`}
                  className="btn-primary w-full text-center dark:bg-primary-700 dark:hover:bg-primary-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostItemsDashboard; 