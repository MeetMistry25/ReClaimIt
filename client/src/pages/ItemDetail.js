import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const categoryBackgrounds = {
  'Electronics': '/assets/electronics.jpg',
  'Books': '/assets/books.jpeg',
  'Clothing': '/assets/clothing.jpg',
  'Accessories': '/assets/accessories.jpeg',
  'Keys': '/assets/keys.jpg',
  'Documents': '/assets/document.jpg',
  'ID Cards': '/assets/ids.jpg',
  'Wallets': '/assets/wallet.jpg',
  'Others': '/assets/others.jpg'
};

const ItemDetail = () => {
  const { id, type } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimAnswers, setClaimAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLost = useMemo(() => type === 'lost', [type]);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/items/${isLost ? 'lost' : 'found'}/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load item');
        }
        setItem(data.item);
        
        // Initialize claim answers array with standard validation questions
        const standardQuestions = [
          { question: "What day was the item lost/found?", answer: "" },
          { question: "Where exactly was the item lost/found?", answer: "" },
          { question: "Describe a unique feature of this item that only the owner would know:", answer: "" }
        ];
        
        // Add any item-specific validation questions if they exist
        if (data.item.validationQuestions && data.item.validationQuestions.length > 0) {
          setClaimAnswers([
            ...standardQuestions,
            ...data.item.validationQuestions.map(q => ({ 
              question: q.question, 
              answer: '' 
            }))
          ]);
        } else {
          setClaimAnswers(standardQuestions);
        }
      } catch (e) {
        setError(e.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (id && (type === 'lost' || type === 'found')) {
      fetchItem();
    } else {
      setError('Invalid item URL');
      setLoading(false);
    }
  }, [id, isLost, type]);

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login', { state: { from: `/item/${type}/${id}` } });
      return;
    }
    
    // Validate answers
    const emptyAnswers = claimAnswers.some(a => !a.answer.trim());
    if (emptyAnswers) {
      setClaimError('Please answer all validation questions');
      return;
    }
    
    setSubmitting(true);
    setClaimError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setClaimError('Authentication required. Please login again.');
        navigate('/login', { state: { from: `/item/${type}/${id}` } });
        return;
      }
      
      const response = await fetch('/api/claims/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: id,
          itemType: isLost ? 'LostItem' : 'FoundItem',
          answers: claimAnswers
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, redirect to login
          localStorage.removeItem('token');
          setClaimError('Session expired. Please login again.');
          setTimeout(() => {
            navigate('/login', { state: { from: `/item/${type}/${id}` } });
          }, 2000);
          return;
        }
        throw new Error(data.message || 'Failed to submit claim');
      }
      
      setClaimSuccess(true);
      setShowClaimModal(false);
    } catch (err) {
      console.error('Claim submission error:', err);
      setClaimError(err.message || 'An error occurred while submitting your claim');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...claimAnswers];
    updatedAnswers[index].answer = value;
    setClaimAnswers(updatedAnswers);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
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

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <div className="mt-4">
            <Link to={isLost ? '/lost-items' : '/found-items'} className="btn-secondary">Back</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="max-w-5xl mx-auto dark:bg-gray-900 dark:text-gray-100">
      {claimSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-medium">Your claim has been submitted successfully!</p>
          <p className="text-sm">An administrator will review your claim and contact you soon.</p>
        </div>
      )}
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-100 mb-1">{item.itemName}</h1>
          <p className="text-gray-600 dark:text-gray-300 capitalize">{isLost ? 'Lost Item' : 'Found Item'}</p>
        </div>
        <Link to={isLost ? '/lost-items' : '/found-items'} className="btn-secondary">Back to {isLost ? 'Lost' : 'Found'} Items</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-0 overflow-hidden dark:bg-gray-800 dark:border-gray-700 flex justify-center items-center"
             style={{ minHeight: '20rem' }}>
          {item.imageUrl ? (
            <>
              <img
                src={item.imageUrl}
                alt={item.itemName}
                className="w-full h-full object-contain cursor-zoom-in"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                onClick={() => setShowModal(true)}
              />
              {showModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                  onClick={() => setShowModal(false)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="max-w-3xl max-h-[80vh] rounded-lg shadow-2xl"
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}
            </>
          ) : (
            <div
              className="w-full h-full bg-gray-100 dark:bg-gray-900 flex justify-center items-center"
              style={item.category && categoryBackgrounds[item.category] ? {
                backgroundImage: `url(${categoryBackgrounds[item.category]})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center'
              } : { minHeight: '20rem' }}
            />
          )}
        </div>

        <div className="card dark:bg-gray-800 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
                <div className="font-medium">{item.category}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-medium capitalize">{item.status}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">{isLost ? 'Place Lost' : 'Place Found'}</div>
                <div className="font-medium">{isLost ? item.placeLost : item.placeFound}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-500 dark:text-gray-400">{isLost ? 'Date Lost' : 'Date Found'}</div>
                <div className="font-medium">{formatDate(isLost ? item.dateLost : item.dateFound)}</div>
              </div>
              
            </div>

            
            {/* Claim Button - Only show for found items */}
            {!isLost && item.status === 'active' && !claimSuccess && (
              <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                <button 
                  onClick={() => setShowClaimModal(true)}
                  className="btn-primary w-full"
                  disabled={submitting}
                >
                  Claim This Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Claim Item: {item.itemName}</h3>
            
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Please answer the following validation questions to submit your claim.
            </p>
            
            {claimError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {claimError}
              </div>
            )}
            
            <form onSubmit={handleClaimSubmit}>
              {claimAnswers.map((qa, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                    {qa.question}
                  </label>
                  <input
                    type="text"
                    value={qa.answer}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Your answer"
                    required
                  />
                </div>
              ))}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className="btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;