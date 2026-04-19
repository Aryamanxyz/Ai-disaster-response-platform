import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../api/axiosInstance';
import { useSocket } from './SocketContext';

const DisasterContext = createContext();

export const DisasterProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchIncidents();
    fetchResources();
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNewIncident = (incident) => setIncidents(prev => [incident, ...prev]);
    const onUpdatedIncident = (updated) => setIncidents(prev => prev.map(inc => inc._id === updated._id ? updated : inc));
    const onAlert = (alert) => setAlerts(prev => [alert, ...prev]);
    const onResourceUpdated = (updated) => setResources(prev => prev.map(res => res._id === updated._id ? updated : res));

    socket.on('incident:new', onNewIncident);
    socket.on('incident:updated', onUpdatedIncident);
    socket.on('alert:received', onAlert);
    socket.on('resource:updated', onResourceUpdated);

    return () => {
      socket.off('incident:new', onNewIncident);
      socket.off('incident:updated', onUpdatedIncident);
      socket.off('alert:received', onAlert);
      socket.off('resource:updated', onResourceUpdated);
    };
  }, [socket]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/incidents');
      setIncidents(res.data.incidents || []);
    } catch (error) {
      console.log('Incidents fetch error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await api.get('/resources');
      setResources(res.data.resources || []);
    } catch (error) {
      console.log('Resources fetch error:', error.message);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/alerts');
      setAlerts(res.data.alerts || []);
    } catch (error) {
      console.log('Alerts fetch error:', error.message);
    }
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  return (
    <DisasterContext.Provider value={{
      incidents,
      alerts,
      resources,
      loading,
      fetchIncidents,
      fetchResources,
      fetchAlerts,
      setIncidents,
      setAlerts,
      markAllAsRead
    }}>
      {children}
    </DisasterContext.Provider>
  );
};

export const useDisaster = () => useContext(DisasterContext);