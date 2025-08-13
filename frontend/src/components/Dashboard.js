import React, { useState, useMemo } from 'react';
import StatsCard from './StatsCard';
import TendersTable from './TendersTable';
import TenderForm from './TenderForm';
import TopEntitiesChart from './TopEntitiesChart';
import TendersByMonthChart from './TendersByMonthChart';
import { DollarSign, Hash, CheckCircle, BarChart2 } from 'lucide-react';

const Dashboard = ({ tenders, api_url, refreshData }) => {
    const [editingTender, setEditingTender] = useState(null);

    const stats = useMemo(() => {
        if (!tenders || tenders.length === 0) {
            return { totalTenders: 0, averageBudget: 0, highestBudget: 0, lowestBudget: 0, awardedTenders: 0 };
        }
        const budgets = tenders.map(t => t.budgetAmount).filter(b => b > 0);
        const totalTenders = tenders.length;
        const totalBudget = budgets.reduce((sum, b) => sum + b, 0);
        const averageBudget = budgets.length > 0 ? totalBudget / budgets.length : 0;
        const highestBudget = budgets.length > 0 ? Math.max(...budgets) : 0;
        const lowestBudget = budgets.length > 0 ? Math.min(...budgets) : 0;
        const awardedTenders = tenders.filter(t => t.status === 'Awarded').length;
        return { totalTenders, averageBudget, highestBudget, lowestBudget, awardedTenders };
    }, [tenders]);

    const handleEdit = (tender) => {
        setEditingTender(tender);
        document.getElementById('tender-form-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFormSuccess = () => {
        setEditingTender(null);
        refreshData();
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-gray-900 border-r border-gray-700 p-6 hidden lg:block">
                <div className="flex items-center mb-10">
                    <img src="/adb-logo.svg" alt="Logo" className="h-10 w-10 mr-3" />
                    <h1 className="text-xl font-bold text-white">E-Procurement</h1>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a href="#" className="flex items-center px-4 py-3 text-gray-300 bg-gray-800 rounded-lg font-semibold">
                                <BarChart2 className="w-5 h-5 mr-3" />
                                Dashboard
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="flex-1 p-6 lg:p-10">
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold text-white">Dashboard Overview</h2>
                    <p className="text-gray-400 mt-2">Welcome! Here's a summary of the procurement activities.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                    <StatsCard icon={<Hash />} title="Total Tenders" value={stats.totalTenders} />
                    <StatsCard icon={<DollarSign />} title="Avg. Budget" value={`$${stats.averageBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
                    <StatsCard icon={<DollarSign color="#22C55E"/>} title="Highest Budget" value={`$${stats.highestBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
                    <StatsCard icon={<DollarSign color="#EF4444"/>} title="Lowest Budget" value={`$${stats.lowestBudget.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} />
                    <StatsCard icon={<CheckCircle />} title="Awarded Tenders" value={stats.awardedTenders} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
                    <div className="lg:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <TendersByMonthChart tenders={tenders} />
                    </div>
                    <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl shadow-lg">
                        <TopEntitiesChart tenders={tenders} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div id="tender-form-section" className="lg:col-span-1">
                        <TenderForm editingTender={editingTender} api_url={api_url} onSuccess={handleFormSuccess} onCancel={() => setEditingTender(null)} />
                    </div>
                    <div className="lg:col-span-2">
                        <TendersTable tenders={tenders} onEdit={handleEdit} api_url={api_url} refreshData={refreshData} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;