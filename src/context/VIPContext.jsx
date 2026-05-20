import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const VIPContext = createContext();

export const VIPProvider = ({ children }) => {
  const [vipList, setVipList] = useState([]);
  const [svipList, setSvipList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [vipData, svipData] = await Promise.all([
        api.get('/vip-list'),
        api.get('/svip-list')
      ]);

      if (vipData.status) setVipList(vipData.data);
      if (svipData.status) setSvipList(svipData.data);

    } catch (err) {
      console.error("VIP Context Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <VIPContext.Provider value={{ vipList, svipList, loading, error, refreshData: fetchData }}>
      {children}
    </VIPContext.Provider>
  );
};

export const useVIPData = () => {
  const context = useContext(VIPContext);
  if (!context) throw new Error("useVIPData must be used within a VIPProvider");
  return context;
};
