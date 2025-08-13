import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TopEntitiesChart = ({ tenders }) => {
    const chartData = useMemo(() => {
        const entityCounts = tenders.reduce((acc, { procuringEntity }) => {
            acc[procuringEntity] = (acc[procuringEntity] || 0) + 1;
            return acc;
        }, {});
        const sortedEntities = Object.entries(entityCounts).sort(([, a], [, b]) => b - a).slice(0, 5);
        return {
            labels: sortedEntities.map(e => e[0]),
            datasets: [{
                label: 'Tenders',
                data: sortedEntities.map(e => e[1]),
                backgroundColor: ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(139, 92, 246, 0.7)'],
                borderColor: '#1F2937', // bg-gray-800
                borderWidth: 2,
            }]
        };
    }, [tenders]);

    const options = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#D1D5DB' } },
            title: { display: true, text: 'Top 5 Procuring Entities', color: '#E5E7EB', font: { size: 18, weight: 'bold' } }
        }
    };

    return <div style={{height: '350px'}}><Doughnut data={chartData} options={options} /></div>;
};

export default TopEntitiesChart;
