import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TagIcon
} from '@heroicons/react/24/outline';

const FoundItemsDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchFoundItems();
  }, []);

  const fetchFoundItems = async () => {
    try {
      const response = await fetch('/api/items/found');
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching found items:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-100 mb-2">Browse Items</h1>
        <p className="text-gray-600 dark:text-gray-300">Browse items that have been found and reported by students</p>
      </div>

      {/* No search and filters section */}

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {items.length} item{items.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-primary-100 mb-2">No items found</h3>
          <p className="text-gray-600 dark:text-gray-300">There are currently no found items in the system</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="card hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              {/* Item Image */}
              <div
                className="aspect-w-16 aspect-h-12 mb-4 bg-gray-100 rounded-lg overflow-hidden dark:bg-gray-900 relative"
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
                    className="w-full h-72 object-cover dark:bg-gray-900"
                  />
                ) : (
                  <div className="w-full h-72 flex items-center justify-center text-gray-400 bg-opacity-60" style={{background: 'rgba(0,0,0,0.3)'}}>
                    <TagIcon className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Item Info: Only title and button */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-primary-100 line-clamp-2">
                  {item.itemName} 
                </h3>
                <div className="my-6"></div> {/* Adds blank space between name and button */}
                <Link
                  to={`/item/found/${item._id}`}
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

export default FoundItemsDashboard;