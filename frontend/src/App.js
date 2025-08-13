import React, { useState, useEffect } from 'react';
import './index.css';

// Main App component
const App = () => {
  const [tenders, setTenders] = useState([]);
  const [currentTender, setCurrentTender] = useState({
    procurementNumber: '',
    subjectOfProcurement: '',
    procuringEntity: '',
    status: 'Draft',
    tenderDeadline: '',
    budgetAmount: 0
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/tenders';

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTenders(data);
    } catch (error) {
      console.error("Failed to fetch tenders:", error);
      setError("Failed to load tenders. The backend might not be running.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTender({ ...currentTender, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tenderToSend = {
        ...currentTender,
        budgetAmount: parseFloat(currentTender.budgetAmount),
        tenderDeadline: currentTender.tenderDeadline ? new Date(currentTender.tenderDeadline) : null
      };

      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${API_URL}/${currentTender.id}` : API_URL;
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenderToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to save tender');
      }

      setCurrentTender({
        procurementNumber: '',
        subjectOfProcurement: '',
        procuringEntity: '',
        status: 'Draft',
        tenderDeadline: '',
        budgetAmount: 0
      });
      setEditing(false);
      fetchTenders();
    } catch (error) {
      console.error("Failed to save tender:", error);
      setError("Failed to save tender. Check your connection.");
    }
  };

  const handleEdit = (tender) => {
    setCurrentTender({
      ...tender,
      tenderDeadline: tender.tenderDeadline ? tender.tenderDeadline.split('T')[0] : ''
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTenders();
    } catch (error) {
      console.error("Failed to delete tender:", error);
      setError("Failed to delete tender. Check your connection.");
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedTenders = React.useMemo(() => {
    let sortableItems = [...tenders];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [tenders, sortConfig]);

  const filteredTenders = sortedTenders.filter(tender =>
    Object.values(tender).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="container mx-auto max-w-6xl">
        <header className="mb-10 text-center flex items-center justify-center">
        <img 
            src="/adb-logo.svg" 
            alt="Asian Development Bank Logo" 
            className="h-16 w-16 mr-4 rounded-full" 
        />
        <div>
            <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight leading-tight">Proof-of-Concept-E-Procurement Application</h1>
            <p className="mt-3 text-lg text-gray-600">Manage tenders with this proof-of-concept application.</p>
        </div>
        </header>

        {/* Tender Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{editing ? 'Edit Tender' : 'Create New Tender'}</h2>
          {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="procurementNumber">Procurement Number</label>
              <input
                type="text"
                id="procurementNumber"
                name="procurementNumber"
                value={currentTender.procurementNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g., 19040162881165"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="subjectOfProcurement">Subject of Procurement</label>
              <input
                type="text"
                id="subjectOfProcurement"
                name="subjectOfProcurement"
                value={currentTender.subjectOfProcurement}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g., Office Supplies"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="procuringEntity">Procuring Entity</label>
              <input
                type="text"
                id="procuringEntity"
                name="procuringEntity"
                value={currentTender.procuringEntity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="e.g., Public Procurement Department"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={currentTender.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Evaluation">Evaluation</option>
                <option value="Awarded">Awarded</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="tenderDeadline">Tender Deadline</label>
              <input
                type="date"
                id="tenderDeadline"
                name="tenderDeadline"
                value={currentTender.tenderDeadline}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="budgetAmount">Budget Amount</label>
              <input
                type="number"
                id="budgetAmount"
                name="budgetAmount"
                value={currentTender.budgetAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-300 shadow-lg transform hover:scale-105"
              >
                {editing ? 'Update Tender' : 'Add Tender'}
              </button>
            </div>
          </form>
        </div>

        {/* Tender List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Current Tenders</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search tenders..."
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <span className="ml-4 text-gray-500">Loading tenders...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('procurementNumber')}
                    >
                      Procurement # {renderSortArrow('procurementNumber')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('subjectOfProcurement')}
                    >
                      Subject {renderSortArrow('subjectOfProcurement')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('procuringEntity')}
                    >
                      Entity {renderSortArrow('procuringEntity')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('status')}
                    >
                      Status {renderSortArrow('status')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('tenderDeadline')}
                    >
                      Deadline {renderSortArrow('tenderDeadline')}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('budgetAmount')}
                    >
                      Budget {renderSortArrow('budgetAmount')}
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenders.length > 0 ? (
                    filteredTenders.map((tender) => (
                      <tr key={tender.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tender.procurementNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tender.subjectOfProcurement}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tender.procuringEntity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${tender.status === 'Published' ? 'bg-green-100 text-green-800' :
                              tender.status === 'Evaluation' ? 'bg-yellow-100 text-yellow-800' :
                              tender.status === 'Awarded' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {tender.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tender.tenderDeadline).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${tender.budgetAmount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2">
                          <button
                            onClick={() => handleEdit(tender)}
                            className="text-yellow-600 hover:text-yellow-900 transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(tender.id)}
                            className="text-red-600 hover:text-red-900 transition duration-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No tenders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
