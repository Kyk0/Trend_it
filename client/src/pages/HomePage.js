import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Home = () => {
    const [randomRow, setRandomRow] = useState(null);
    const [nearestRow, setNearestRow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/fetch-data/");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setRandomRow(data.random_row);
            setNearestRow(data.nearest_row);
        } catch (err) {
            setError(err.message);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="text-white text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    if (!randomRow || !nearestRow) {
        return <div className="text-yellow-500 text-center mt-10">No data available.</div>;
    }

    const generateChartData = (row, color) => ({
        labels: Array.from({ length: 11 }, (_, i) => (2010 + i).toString()),
        datasets: [
            {
                label: row.Label,
                data: row.Normalized_Data.split(',').map(Number),
                borderColor: color,
                backgroundColor: `${color}80`,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
            },
        ],
    });

    const chartOptions = (row) => ({
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#ddd',
                },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const year = tooltipItem.label;
                        const value = row[year];
                        return `Year: ${year}, Value: ${value}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#ddd',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            y: {
                ticks: {
                    callback: (_, index) => row[2010 + index],
                    color: '#ddd',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
            <div className="absolute top-5 right-5 text-gray-400 text-sm">
                <p>Trend-it Visualization</p>
            </div>

            <h1 className="text-4xl font-bold mb-8">Dual Time Series Chart</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl p-6 bg-gray-800 bg-opacity-90 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-xl mb-2">{randomRow.Description}</h2>
                    <p className="text-sm mb-4">
                        Unit of Measure: {randomRow["Unit of measure"]} | Attributes: {randomRow.Attributes}
                    </p>
                    <Line
                        data={generateChartData(randomRow, 'rgba(255, 127, 80, 1)')}
                        options={chartOptions(randomRow)}
                    />
                </div>

                <div>
                    <h2 className="text-xl mb-2">{nearestRow.Description}</h2>
                    <p className="text-sm mb-4">
                        Unit of Measure: {nearestRow["Unit of measure"]} | Attributes: {nearestRow.Attributes}
                    </p>
                    <Line
                        data={generateChartData(nearestRow, 'rgba(123, 104, 238, 1)')}
                        options={chartOptions(nearestRow)}
                    />
                </div>
            </div>

            <button
                className={`mt-6 px-6 py-3 ${
                    refreshing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-lg text-lg font-medium transition-transform transform hover:scale-105 shadow-md`}
                onClick={fetchData}
                disabled={refreshing}
            >
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
        </div>
    );
};

export default Home;