import React from 'react';
import Framework7 from 'framework7/lite-bundle';
import Framework7React from 'framework7-react';
import { App as F7App, View, Statusbar } from 'framework7-react';
import routes from './routes.js';
import { AppProvider } from './store/AppContext.jsx';
import OfflineBanner from './components/OfflineBanner.jsx';
import MainPanel from './components/MainPanel.jsx';

Framework7.use(Framework7React);

const MyApp = () => {
  const f7params = {
    name: 'App Catastro',
    theme: 'auto',
    id: 'com.app.catastro',
    routes,
    view: {
      pushState: true
    }
  };

  return (
    <AppProvider>
      <F7App {...f7params}>
        <Statusbar />
        <MainPanel />
        <OfflineBanner />
        <View main className="safe-areas" url="/" />
      </F7App>
    </AppProvider>
  );
};

export default MyApp;
