import React, { useState, useEffect, useRef } from 'react';
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

const GraphSection = () => {
    const [data, setData] = useState({ randomRow: null, nearestRow: null });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    const fetchData = async () => {
        setRefreshing(true);
        setError(null);
        setData({ randomRow: null, nearestRow: null });
        try {
            const response = await fetch("https://trend-it.onrender.com/api/fetch-data/");
            // const response = await fetch("http://127.0.0.1:8000/api/fetch-data/");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            setData({
                randomRow: result.random_row,
                nearestRow: result.nearest_row,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchData();
        }
    }, []);

    const generateChartData = (row, color) => {
        const realValues = Object.values(row).slice(0, 11);
        const normalizedValues = row.Normalized_Data.split(',').map(Number);

        return {
            labels: Array.from({ length: 11 }, (_, i) => (2010 + i).toString()),
            datasets: [
                {
                    label: row.Label,
                    data: normalizedValues,
                    borderColor: color,
                    pointBackgroundColor: color,
                    backgroundColor: `${color}80`,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    realValues: realValues,
                },
            ],
        };
    };

    const chartOptions = (row) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#ffffff' },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const dataset = tooltipItem.dataset;
                        const realValue = dataset.realValues[tooltipItem.dataIndex];
                        return `Year: ${tooltipItem.label}, Value: ${realValue}`;
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
            y: {
                ticks: {
                    color: '#ffffff',
                    callback: function (_, index) {
                        return row[2010 + index];
                    },
                },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
            },
        },
    });

    return (
        <div id="graph-section"
            className="min-h-screen w-full bg-background-main flex items-center justify-center text-white px-8">
            <div className="text-center max-w-6xl w-full">
                <h2 className="text-4xl font-bold mb-8 animate-on-scroll">Explore Trends</h2>

                <div className="bg-background-secondary p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 animate-on-scroll">

                    <div className="relative w-full flex flex-col justify-between">
                        {refreshing || loading || !data.randomRow ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <h3 className="text-xl leading-tight h-12">{data.randomRow.Description}</h3>
                                    <p className="text-sm">
                                        Unit: {data.randomRow["Unit of measure"]} | Label: {data.randomRow.Label}
                                    </p>
                                </div>
                                <div className="relative h-64 w-full">
                                    <Line
                                        data={generateChartData(data.randomRow, 'rgba(255, 127, 80, 1)')}
                                        options={chartOptions(data.randomRow)}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative  w-full flex flex-col justify-between">
                        {refreshing || loading || !data.nearestRow ? (
                            <div className="flex items-center justify-center h-80">
                                <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-4">
                                    <h3 className="text-xl leading-tight h-12">{data.nearestRow.Description}</h3>
                                    <p className="text-sm">
                                        Unit: {data.nearestRow["Unit of measure"]} | Label: {data.nearestRow.Label}
                                    </p>
                                </div>
                                <div className="relative h-64 w-full">
                                    <Line
                                        data={generateChartData(data.nearestRow, 'rgba(123, 104, 238, 1)')}
                                        options={chartOptions(data.nearestRow)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <button
                    className={`mt-6 px-6 py-3 ${
                        refreshing ? 'bg-gray-400' : 'bg-button-primary hover:bg-button-hover'
                    } text-white rounded-lg text-lg font-medium transition-transform transform hover:scale-105 animate-on-scroll`}
                    onClick={fetchData}
                    disabled={refreshing}
                >
                    {refreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>
        </div>
    );
};

export default GraphSection;