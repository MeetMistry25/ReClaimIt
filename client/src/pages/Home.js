import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MagnifyingGlassIcon,
      title: 'Smart Matching',
      description: 'Our AI-powered system matches lost and found items based on location, time, and description.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Claims',
      description: 'Verification system prevents false claims and ensures items go to their rightful owners.'
    },
    {
      icon: ClockIcon,
      title: 'Real-time Updates',
      description: 'Get instant notifications when your lost item is found or when someone claims your found item.'
    },
    {
      icon: UserGroupIcon,
      title: 'Campus Community',
      description: 'Connect with fellow students and staff to help recover lost items across campus.'
    }
  ];

  const stats = [
    { label: 'Items Recovered', value: '' },
    { label: 'Active Users', value: '' },
    { label: 'Success Rate', value: '' },
    { label: 'Response Time', value: '' }
  ];

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white dark:from-gray-800 dark:to-gray-900 dark:text-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find What You've Lost
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              The ultimate platform for university students to report lost items and help others find their belongings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/report-lost"
                    className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-primary-200 dark:hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <PlusIcon className="h-5 w-5" />
                    <span>Report Lost Item</span>
                  </Link>
                  <Link
                    to="/report-found"
                    className="bg-primary-500 hover:bg-primary-400 text-white dark:bg-primary-700 dark:hover:bg-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Report Found Item</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-gray-100 dark:bg-gray-700 dark:text-primary-200 dark:hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-primary-100 mb-4">
              Why Choose ReClaimIt?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We make it easy to recover lost items and help others find their belongings with our comprehensive platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center dark:bg-gray-800 dark:border-gray-700">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 dark:bg-primary-900">
                  <feature.icon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-primary-100 mb-6">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-300 mb-4">Platform Success</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="flex-1">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">0%</div>
              <div className="text-gray-700 dark:text-gray-200">Success Rate</div>
            </div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">0</div>
              <div className="text-gray-700 dark:text-gray-200">Items Found</div>
            </div>
          </div>
        </div>
      </section>

      {/* Removed CTA Section and Footer as requested */}
    </div>
  );
};

export default Home; 