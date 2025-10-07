import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [myLostItems, setMyLostItems] = useState([]);
  const [loadingLost, setLoadingLost] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    setShowModal(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  useEffect(() => {
    const fetchMyLostItems = async () => {
      if (!user) return;
      setLoadingLost(true);
      try {
        const res = await fetch('/api/items/lost');
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          const currentUserId = user.id || user._id;
          const mine = data.items.filter((it) => {
            const ownerId = (it.userId && (it.userId._id || it.userId)) || null;
            return ownerId === currentUserId;
          });
          setMyLostItems(mine);
        }
      } catch (e) {
        // ignore errors for now
      } finally {
        setLoadingLost(false);
      }
    };
    fetchMyLostItems();
  }, [user]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    const result = await changePassword(oldPassword, newPassword);
    setLoading(false);
    if (result.success) {
      setSuccess('Password changed successfully!');
      setShowModal(false);
    } else {
      setError(result.message || 'Failed to change password');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto dark:bg-gray-900 dark:text-gray-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-primary-100 mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage your account and view your details</p>
      </div>
      <div className="card space-y-6 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold mb-4">User Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><span className="font-medium">Name:</span> {user.name || '-'}</div>
            <div><span className="font-medium">Email:</span> {user.email || '-'}</div>
            <div><span className="font-medium">Student ID:</span> {user.studentId || '-'}</div>
            <div><span className="font-medium">Branch:</span> {user.branch || user.department || '-'}</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="btn-secondary w-full sm:w-auto" onClick={handleChangePassword}>Change Password</button>
          <button className="btn-danger w-full sm:w-auto" onClick={handleLogout}>Logout</button>
        </div>
        {success && <div className="text-green-600 font-semibold dark:text-green-400">{success}</div>}

        {/* My Reported Lost Items */}
        <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Reported Lost Items</h2>
            <button
              className="btn-secondary"
              onClick={async () => {
                setLoadingLost(true);
                try {
                  const res = await fetch('/api/items/lost');
                  const data = await res.json();
                  if (data.success && Array.isArray(data.items)) {
                    const currentUserId = user.id || user._id;
                    const mine = data.items.filter((it) => {
                      const ownerId = (it.userId && (it.userId._id || it.userId)) || null;
                      return ownerId === currentUserId;
                    });
                    setMyLostItems(mine);
                  }
                } catch (e) {
                  // ignore
                } finally {
                  setLoadingLost(false);
                }
              }}
            >
              Refresh
            </button>
          </div>
          {loadingLost ? (
            <div className="text-gray-500 dark:text-gray-300">Loading...</div>
          ) : myLostItems.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-300">No lost items reported yet.</div>
          ) : (
            <ul className="space-y-3">
              {myLostItems.map((it) => (
                <li key={it._id} className="flex items-center justify-between p-3 rounded border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {it.imageUrl ? (
                      <img src={it.imageUrl} alt={it.itemName} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded" />
                    )}
                    <div>
                      <div className="font-medium">{it.itemName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Status: {it.status}</div>
                    </div>
                  </div>
                  <button
                    className="btn-primary dark:bg-primary-700 dark:hover:bg-primary-600"
                    onClick={() => navigate(`/item/lost/${it._id}`)}
                  >
                    View Details
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Change Password Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative dark:bg-gray-800">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-primary-100" onClick={() => setShowModal(false)}>&times;</button>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-primary-100">Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Old Password</label>
                  <input type="password" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">New Password</label>
                  <input type="password" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <div>
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-primary-100" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                </div>
                {error && <div className="text-red-500 text-sm dark:text-red-300">{error}</div>}
                <button type="submit" className="btn-primary w-full dark:bg-primary-700 dark:hover:bg-primary-600" disabled={loading}>{loading ? 'Changing...' : 'Change Password'}</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 