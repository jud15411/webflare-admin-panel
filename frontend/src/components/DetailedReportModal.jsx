import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './DetailedReportModal.css'; // Assuming you have a generic modal stylesheet

const DetailedReportModal = ({ reportType, onClose, userToken }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // A mapping from the report title to the API endpoint
    const reportEndpoints = {
        'Total Revenue': '/api/reports/details/paid-invoices',
        'Outstanding Revenue': '/api/reports/details/sent-invoices',
        'Active Projects': '/api/reports/details/active-projects',
        'Projects Completed': '/api/reports/details/completed-projects',
        'Active Clients': '/api/reports/details/active-clients',
        'New Leads': '/api/reports/details/new-leads',
    };

    useEffect(() => {
        const fetchDetails = async () => {
            const endpoint = reportEndpoints[reportType];
            if (!endpoint) {
                setError('Invalid report type specified.');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${userToken}` } };
                const response = await api.get(endpoint, config);
                setData(response.data);
            } catch (err) {
                setError('Failed to fetch report details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [reportType, userToken]);

    const renderTable = () => {
        if (loading) return <p>Loading details...</p>;
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (data.length === 0) return <p>No data available for this report.</p>;

        const headers = Object.keys(data[0]).filter(key => key !== '_id');

        return (
            <div className="table-container" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                <table className="pro-table">
                    <thead>
                        <tr>
                            {headers.map(header => <th key={header}>{header.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr key={row._id || index}>
                                {headers.map(header => <td key={header}>{row[header]}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{reportType} - Detailed View</h2>
                    <button onClick={onClose} className="modal-close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default DetailedReportModal;