import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const categories = [
  'Electronics',
  'Documents',
  'Clothing',
  'Accessories',
  'Books',
  'Keys',
  'ID Cards',
  'Wallets',
  'Others',
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

const ReportFoundItem = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [form, setForm] = useState({
    date: '',
    location: '',
    itemName: '',
    description: '',
    pickupLocation: 'Student Center - Lost & Found Office',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = 'Required';
    if (!form.location) newErrors.location = 'Required';
    if (!form.itemName) newErrors.itemName = 'Required';
    if (!form.description) newErrors.description = 'Required';
    if (!form.images || form.images.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('itemName', form.itemName);
      formData.append('description', form.description);
      formData.append('category', selectedCategory);
      formData.append('placeFound', form.location);
      formData.append('dateFound', form.date);
      formData.append('pickupLocation', form.pickupLocation);
      
      if (form.images && form.images.length > 0) {
        formData.append('image', form.images[0]); // Backend expects single image
      }

      const response = await fetch('/api/items/found', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          navigate('/found-items');
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Failed to submit item' });
      }
    } catch (error) {
      console.error('Error submitting found item:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-100 mb-2">Report Found Item</h1>
        <p className="text-gray-600 dark:text-gray-300">Report an item you've found on campus</p>
      </div>
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        {!selectedCategory ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Select a Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 mb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn-secondary text-lg md:h-32 md:w-full aspect-square flex items-center justify-center relative overflow-hidden ${selectedCategory === cat ? 'ring-2 ring-primary-500 dark:ring-primary-300' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                  type="button"
                  style={categoryBackgrounds[cat] ? {
                    backgroundImage: `url(${categoryBackgrounds[cat]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  } : {
                    color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  }}
                >
                  <span style={{position: 'relative', zIndex: 2, color: '#fff'}}>{cat}</span>
                  <span style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1}}></span>
                </button>
              ))}
            </div>
          </>
        ) : submitted ? (
          <div className="text-center py-8">
            <div className="text-green-600 dark:text-green-400 text-2xl mb-4">✅</div>
            <div className="text-green-600 dark:text-green-400 font-semibold text-lg mb-2">Item reported successfully!</div>
            <p className="text-gray-600 dark:text-gray-300">Redirecting to found items...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Category</label>
              <div className="font-semibold">{selectedCategory}</div>
            </div>
            <div>
              <label className="form-label">When was it found?</label>
              <input type="date" name="date" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={form.date} onChange={handleChange} required />
              {errors.date && <div className="text-red-500 text-sm">{errors.date}</div>}
            </div>
            <div>
              <label className="form-label">Where was it found?</label>
              <input type="text" name="location" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={form.location} onChange={handleChange} required />
              {errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}
            </div>
            <div>
              <label className="form-label">Name of the item</label>
              <input type="text" name="itemName" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={form.itemName} onChange={handleChange} required />
              {errors.itemName && <div className="text-red-500 text-sm">{errors.itemName}</div>}
            </div>
            <div>
              <label className="form-label">Description</label>
              <textarea name="description" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={form.description} onChange={handleChange} required />
              {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
            </div>
            <div>
              <label className="form-label">Pickup Location</label>
              <input type="text" name="pickupLocation" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={form.pickupLocation} onChange={handleChange} />
            </div>
            <div>
              <label className="form-label">Upload Image (required)</label>
              <input type="file" name="images" accept="image/*" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" onChange={handleImageChange} required />
              {errors.images && <div className="text-red-500 text-sm">{errors.images}</div>}
            </div>
            {errors.submit && (
              <div className="text-red-500 text-sm text-center">{errors.submit}</div>
            )}
            <button 
              type="submit" 
              className="btn-primary w-full dark:bg-primary-700 dark:hover:bg-primary-600"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportFoundItem; 