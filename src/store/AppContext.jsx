import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { initDatabase, getPendingFichas } from '../services/database.js';
import { Network } from '@capacitor/network';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingFichas, setPendingFichas] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const setup = async () => {
      await initDatabase();
      const fichas = await getPendingFichas();
      setPendingFichas(fichas);
    };
    setup();
  }, []);

  useEffect(() => {
    let listener;
    const subscribe = async () => {
      try {
        listener = Network.addListener('networkStatusChange', (status) => {
          setIsOffline(!status.connected);
        });
        const status = await Network.getStatus();
        setIsOffline(!status.connected);
      } catch (error) {
        const updateOnline = () => setIsOffline(!navigator.onLine);
        window.addEventListener('online', updateOnline);
        window.addEventListener('offline', updateOnline);
        return () => {
          window.removeEventListener('online', updateOnline);
          window.removeEventListener('offline', updateOnline);
        };
      }
    };

    const unsubscribe = subscribe();
    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      }
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      pendingFichas,
      setPendingFichas,
      isOffline,
      setIsOffline
    }),
    [user, pendingFichas, isOffline]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext debe usarse dentro de AppProvider');
  }
  return context;
};
