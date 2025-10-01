import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ lostItems: [], foundItems: [] });
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const { user } = useAuth();

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const fetchSearchResults = async (keyword) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items/search?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.message || 'Failed to fetch search results');
      }
    } catch (error) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.history.pushState(
        {},
        '',
        `/search?q=${encodeURIComponent(searchQuery.trim())}`
      );
      fetchSearchResults(searchQuery.trim());
    }
  };

  // Filter to only show found items with images
  const foundItemsWithImages = (results.foundItems || []).filter(item => item.imageUrl && item.imageUrl.trim() !== '');
  const totalResults = foundItemsWithImages.length;
  
  const filteredResults = foundItemsWithImages;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-100 mb-2">Found Items Search</h1>
        <p className="text-gray-600 dark:text-gray-300">
          {query ? (
            <>
              Showing found items with images for <span className="font-semibold">"{query}"</span>
              {totalResults > 0 ? ` (${totalResults} found items with images)` : ' (No found items with images found)'}
            </>
          ) : (
            'Enter a search term to find items with images'
          )}
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search for found items with images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-900"
          >
            Search
          </button>
        </form>
      </div>


      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 dark:bg-red-900/20 dark:border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && query && filteredResults.length === 0 && !error && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-200">No found items with images</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We couldn't find any found items with images matching "{query}". Try using different keywords.
          </p>
        </div>
      )}

      {/* Results Grid */}
      {filteredResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResults.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Item Image */}
              {item.imageUrl && (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {item.itemName}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Found
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div>
                    <span className="font-medium">Category:</span> {item.category}
                  </div>
                  <div>
                    <span className="font-medium">Place Found:</span> {item.placeFound}
                  </div>
                  <div>
                    <span className="font-medium">Date Found:</span> {new Date(item.dateFound).toLocaleDateString()}
                  </div>
                </div>
                
                <Link
                  to={`/item/found/${item._id}`}
                  className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-800"
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

export default Search;