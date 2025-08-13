import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TendersByMonthChart = ({ tenders }) => {
    const chartData = useMemo(() => {
        const counts = { "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0, "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0 };
        tenders.forEach(tender => {
            if (tender.tenderDeadline) {
                const month = new Date(tender.tenderDeadline).getMonth();
                const monthName = Object.keys(counts)[month];
                counts[monthName]++;
            }
        });
        return {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Tenders by Deadline Month',
                data: Object.values(counts),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1, borderRadius: 5,
            }]
        };
    }, [tenders]);

    const options = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Tender Deadlines by Month', color: '#E5E7EB', font: { size: 18, weight: 'bold' } }
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#9CA3AF', stepSize: 1 }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
            x: { ticks: { color: '#9CA3AF' }, grid: { display: false } }
        }
    };

    return <div style={{height: '350px'}}><Bar options={options} data={chartData} /></div>;
};

export default TendersByMonthChart;
