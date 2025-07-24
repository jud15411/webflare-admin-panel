import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const BusinessContext = createContext(null);

export const BusinessProvider = ({ children }) => {
    const [settings, setSettings] = useState({ businessName: 'Webflare Design Co.', logoUrl: '' });
    const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    // This function can be called from the settings page to refresh the context
    const fetchBusinessSettings = async () => {
        try {
            // Note: This is a public endpoint, so no token is needed
            const { data } = await axios.get('/api/settings/public'); // A new public route will be needed
            setSettings({
                ...data,
                fullLogoUrl: data.logoUrl ? `${backendUrl}${data.logoUrl}` : null
            });
        } catch (error) {
            console.error("Could not fetch business settings");
        }
    };
    
    useEffect(() => {
        fetchBusinessSettings();
    }, []);

    return (
        <BusinessContext.Provider value={{ settings, fetchBusinessSettings }}>
            {children}
        </BusinessContext.Provider>
    );
};