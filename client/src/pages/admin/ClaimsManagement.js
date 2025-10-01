import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClaims(activeTab);
  }, [activeTab]);

  const fetchClaims = async (status) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/claims/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClaims(response.data.claims);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch claims');
      setLoading(false);
      console.error(err);
    }
  };

  const handleViewDetails = async (claimId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/api/claims/${claimId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedClaim(response.data.claim);
      setSelectedItem(response.data.item);
    } catch (err) {
      console.error('Error fetching claim details:', err);
    }
  };

  const handleApproveClaim = async (claimId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      const response = await axios.put(`/api/claims/approve/${claimId}`, 
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update UI
      setSelectedClaim(null);
      setSelectedItem(null);
      setAdminNotes('');
      fetchClaims(activeTab);
      
      // Show success message
      alert('Claim approved successfully. Email notification sent to claimant.');
    } catch (err) {
      console.error('Error approving claim:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to approve claim';
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeclineClaim = async (claimId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      const response = await axios.put(`/api/claims/decline/${claimId}`, 
        { adminNotes },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update UI
      setSelectedClaim(null);
      setSelectedItem(null);
      setAdminNotes('');
      fetchClaims(activeTab);
      
      // Show success message
      alert('Claim declined successfully. Email notification sent to claimant.');
    } catch (err) {
      console.error('Error declining claim:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to decline claim';
      alert(`Error: ${errorMessage}`);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  
  if (error) return <div className="text-red-500 text-center p-4 dark:bg-gray-900 dark:text-red-400">{error}</div>;

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Claims Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
        <button 
          className={`py-2 px-4 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Claims
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'approved' ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Claims
        </button>
        <button 
          className={`py-2 px-4 ${activeTab === 'declined' ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          onClick={() => setActiveTab('declined')}
        >
          Declined Claims
        </button>
      </div>

      {/* Claims List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Item</th>
              <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Claimant</th>
              <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Date Submitted</th>
              <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Status</th>
              <th className="py-2 px-4 text-left text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {claims.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500 dark:text-gray-400">No {activeTab} claims found</td>
              </tr>
            ) : (
              claims.map(claim => (
                <tr key={claim._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-2 px-4">
                    {/* Display item type for better identification */}
                    <span className="text-xs font-medium px-1 py-0.5 rounded mr-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                      {claim.itemType === 'FoundItem' ? 'Found' : 'Lost'}
                    </span>
                    {/* We'll show the full item details in the modal */}
                    <span className="text-gray-700 dark:text-gray-300">Item #{claim._id.substring(0, 8)}</span>
                  </td>
                  <td className="py-2 px-4 text-gray-900 dark:text-gray-100">{claim.claimantId?.name || 'Unknown'}</td>
                  <td className="py-2 px-4 text-gray-700 dark:text-gray-300">{formatDate(claim.createdAt)}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      claim.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Unknown'}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button 
                      onClick={() => handleViewDetails(claim._id)}
                      className="text-blue-500 hover:underline dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Claim Details</h2>
            
            {/* Claimant Information - Prominent Display */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Claimant Details
              </h3>
              {selectedClaim.claimantId ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedClaim.claimantId?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedClaim.claimantId?.email || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Claim Submitted</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{formatDate(selectedClaim.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Claim Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedClaim.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                      selectedClaim.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {selectedClaim.status ? selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1) : 'Unknown'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-red-500 dark:text-red-400 font-medium">Claimant information not available</p>
              )}
            </div>

            {/* Item Information */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 flex items-center dark:text-white">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Item Information
              </h3>
              {selectedItem ? (
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Item Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedItem.itemName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedItem.category}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Description</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedItem.description}</p>
                    </div>
                  </div>
                  {selectedItem.imageUrl && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Item Image</p>
                      <img 
                        src={selectedItem.imageUrl.startsWith('http') 
                          ? selectedItem.imageUrl 
                          : `/uploads/${selectedItem.imageUrl}`} 
                        alt="Item" 
                        className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-red-500 dark:text-red-400 font-medium">Item information not available</p>
              )}
            </div>
            
            {/* Validation Questions & Answers - Enhanced */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg text-green-800 dark:text-green-300 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validation Questions & Answers
              </h3>
              <div className="space-y-4">
                {selectedClaim.answers && selectedClaim.answers.length > 0 ? (
                  selectedClaim.answers.map((answer, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">{index + 1}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white mb-2">Question:</p>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">{answer.question}</p>
                          <p className="font-semibold text-gray-900 dark:text-white mb-2">Answer:</p>
                          <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">{answer.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No validation questions were asked for this claim</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Admin Actions Section - Enhanced */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Admin Actions
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  rows="3"
                  placeholder="Add notes about this claim decision..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {selectedClaim.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleDeclineClaim(selectedClaim._id)}
                      className="flex items-center justify-center px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Decline Claim
                    </button>
                    <button 
                      onClick={() => handleApproveClaim(selectedClaim._id)}
                      className="flex items-center justify-center px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Claim
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedClaim.status === 'approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {selectedClaim.status === 'approved' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        )}
                      </svg>
                      Claim {selectedClaim.status ? selectedClaim.status.charAt(0).toUpperCase() + selectedClaim.status.slice(1) : 'Unknown'}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      This claim has already been processed
                    </p>
                  </div>
                )}
              </div>
            </div>


            {/* Close Button */}
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  setSelectedClaim(null);
                  setSelectedItem(null);
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:ring-offset-gray-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimsManagement;