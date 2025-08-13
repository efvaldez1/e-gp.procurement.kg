import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

const App = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // IMPORTANT: Use the environment variable for the API URL.
  // Fallback to localhost for local development.
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/tenders';

  const fetchTenders = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setTenders(data);
    } catch (error) {
      console.error("Failed to fetch tenders:", error);
      setError("Failed to load tenders. The backend might be down or the API URL is incorrect.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent"></div>
        <p className="mt-4 text-lg">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white p-4">
        <div className="bg-red-800 border border-red-600 p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">An Error Occurred</h2>
            <p className="text-red-200">{error}</p>
            <p className="mt-4 text-sm text-gray-400">Please check the browser console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      <Dashboard tenders={tenders} api_url={API_URL} refreshData={fetchTenders} />
    </div>
  );
};

export default App;