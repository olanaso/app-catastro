import React from 'react';
import { useAppContext } from '../store/AppContext.jsx';

const OfflineBanner = () => {
  const { isOffline } = useAppContext();

  if (!isOffline) {
    return null;
  }

  return <div className="offline-indicator">Modo Offline</div>;
};

export default OfflineBanner;
