import React, { useState, useEffect } from 'react';

const TenderForm = ({ editingTender, api_url, onSuccess, onCancel }) => {
    const [tender, setTender] = useState({
        procurementNumber: '', subjectOfProcurement: '', procuringEntity: '',
        status: 'Draft', tenderDeadline: '', budgetAmount: 0
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (editingTender) {
            setTender({
                ...editingTender,
                tenderDeadline: editingTender.tenderDeadline ? editingTender.tenderDeadline.split('T')[0] : ''
            });
        } else {
            setTender({
                procurementNumber: '', subjectOfProcurement: '', procuringEntity: '',
                status: 'Draft', tenderDeadline: '', budgetAmount: 0
            });
        }
    }, [editingTender]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTender({ ...tender, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const tenderToSend = {
                ...tender,
                budgetAmount: parseFloat(tender.budgetAmount),
                tenderDeadline: tender.tenderDeadline ? new Date(tender.tenderDeadline) : null
            };
            const method = editingTender ? 'PUT' : 'POST';
            const url = editingTender ? `${api_url}/${tender.id}` : api_url;
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tenderToSend),
            });
            if (!response.ok) throw new Error('Failed to save tender');
            onSuccess();
        } catch (err) {
            setError("Failed to save tender. Please check the data and try again.");
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg h-full">
            <h3 className="text-2xl font-bold text-white mb-6">{editingTender ? 'Edit Tender' : 'Create New Tender'}</h3>
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="procurementNumber">Procurement Number</label>
                    <input type="text" id="procurementNumber" name="procurementNumber" value={tender.procurementNumber} onChange={handleInputChange} className="w-full bg-gray-700 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="subjectOfProcurement">Subject</label>
                    <input type="text" id="subjectOfProcurement" name="subjectOfProcurement" value={tender.subjectOfProcurement} onChange={handleInputChange} className="w-full bg-gray-700 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="procuringEntity">Procuring Entity</label>
                    <input type="text" id="procuringEntity" name="procuringEntity" value={tender.procuringEntity} onChange={handleInputChange} className="w-full bg-gray-700 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="status">Status</label>
                    <select id="status" name="status" value={tender.status} onChange={handleInputChange} className="w-full bg-gray-700 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Evaluation">Evaluation</option>
                        <option value="Awarded">Awarded</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="tenderDeadline">Deadline</label>
                    <input type="date" id="tenderDeadline" name="tenderDeadline" value={tender.tenderDeadline} onChange={handleInputChange} className="w-full bg-gray-700 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                </div>
                <div>
                    <label className="block text-gray-400 text-sm font-semibold mb-2" htmlFor="budgetAmount">Budget</label>
                    <input type="number" id="budgetAmount" name="budgetAmount" value={tender.budgetAmount} onChange={handleInputChange} className="w-full bg-gray-700 text-white px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" step="0.01" required />
                </div>
                <div className="flex space-x-4 pt-4">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg">{editingTender ? 'Update Tender' : 'Add Tender'}</button>
                    {editingTender && (<button type="button" onClick={onCancel} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition">Cancel</button>)}
                </div>
            </form>
        </div>
    );
};

export default TenderForm;