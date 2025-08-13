import React, { useState, useMemo } from 'react';

const TendersTable = ({ tenders, onEdit, api_url, refreshData }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tender?')) {
            try {
                await fetch(`${api_url}/${id}`, { method: 'DELETE' });
                refreshData();
            } catch (error) {
                alert("Failed to delete tender.");
            }
        }
    };
    
    const handleSort = (key) => {
        let direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredTenders = useMemo(() => {
        let sortableItems = [...tenders];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems.filter(tender =>
            Object.values(tender).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [tenders, sortConfig, searchTerm]);
    
    const renderSortArrow = (key) => sortConfig.key === key ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : null;

    const getStatusClass = (status) => {
        const classes = {
            'Published': 'bg-green-500/20 text-green-300', 'Evaluation': 'bg-yellow-500/20 text-yellow-300',
            'Awarded': 'bg-blue-500/20 text-blue-300', 'Closed': 'bg-red-500/20 text-red-300',
        };
        return classes[status] || 'bg-gray-500/20 text-gray-300';
    };

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg h-full">
            <h3 className="text-2xl font-bold text-white mb-6">Manage Tenders</h3>
            <input
              type="text" placeholder="Search tenders..."
              className="w-full px-4 py-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('procurementNumber')}># {renderSortArrow('procurementNumber')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('subjectOfProcurement')}>Subject {renderSortArrow('subjectOfProcurement')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>Status {renderSortArrow('status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('budgetAmount')}>Budget {renderSortArrow('budgetAmount')}</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {sortedAndFilteredTenders.map((tender) => (
                            <tr key={tender.id} className="hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{tender.procurementNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{tender.subjectOfProcurement}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(tender.status)}`}>{tender.status}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">${tender.budgetAmount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => onEdit(tender)} className="text-yellow-400 hover:text-yellow-300">Edit</button>
                                    <button onClick={() => handleDelete(tender.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TendersTable;