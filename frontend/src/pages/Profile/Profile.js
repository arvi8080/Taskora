import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        },
        preferences: {
          language: user.preferences?.language || 'en',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? true,
            push: user.preferences?.notifications?.push ?? true,
          },
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
    } else if (name.startsWith('notifications.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          notifications: {
            ...prev.preferences.notifications,
            [key]: checked,
          },
        },
      }));
    } else if (name === 'language') {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          language: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const updateData = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      preferences: formData.preferences,
    };
    const result = await updateProfile(updateData);
    setLoading(false);
    if (result.success) {
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pincode: user.address?.pincode || '',
        },
        preferences: {
          language: user.preferences?.language || 'en',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? true,
            push: user.preferences?.notifications?.push ?? true,
          },
        },
      });
    }
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-soft"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <button
              onClick={() => (editMode ? handleCancel() : setEditMode(true))}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {!editMode ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Personal Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{user?.name || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user?.email || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{user?.phone || '-'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Address</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Street</label>
                      <p className="text-gray-900">{user?.address?.street || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <p className="text-gray-900">{user?.address?.city || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <p className="text-gray-900">{user?.address?.state || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pincode</label>
                      <p className="text-gray-900">{user?.address?.pincode || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <p className="text-gray-900">{user?.preferences?.language || 'English'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-2">Email:</span>
                        <span className={`text-sm ${user?.preferences?.notifications?.email ? 'text-green-600' : 'text-red-600'}`}>
                          {user?.preferences?.notifications?.email ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-2">SMS:</span>
                        <span className={`text-sm ${user?.preferences?.notifications?.sms ? 'text-green-600' : 'text-red-600'}`}>
                          {user?.preferences?.notifications?.sms ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-700 mr-2">Push:</span>
                        <span className={`text-sm ${user?.preferences?.notifications?.push ? 'text-green-600' : 'text-red-600'}`}>
                          {user?.preferences?.notifications?.push ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Address</h2>

                  <div>
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="address.pincode" className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      id="address.pincode"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={formData.preferences.language}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="gu">Gujarati</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                      <option value="bn">Bengali</option>
                      <option value="pa">Punjabi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Notifications
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifications.email"
                          checked={formData.preferences.notifications.email}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifications.sms"
                          checked={formData.preferences.notifications.sms}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">SMS notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="notifications.push"
                          checked={formData.preferences.notifications.push}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Push notifications</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;



