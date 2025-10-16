import React from 'react';
import { Panel, View, Page, Navbar, List, ListItem } from 'framework7-react';
import { useAppContext } from '../store/AppContext.jsx';
import { useRouter } from 'framework7-react';

const MainPanel = () => {
  const { setUser } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.navigate('/', { reloadCurrent: true });
  };

  return (
    <Panel left cover>
      <View>
        <Page>
          <Navbar title="Menú" />
          <List strong inset>
            <ListItem title="Mapa" link="/home" panelClose />
            <ListItem title="Pendientes" link="/pendientes" panelClose />
            <ListItem title="Atendidos del día" link="/home" panelClose />
            <ListItem title="Registrar Ficha" link="/registrar" panelClose />
            <ListItem title="Actualizar Ficha" link="/home" panelClose />
            <ListItem title="Enviar Información" link="/enviar" panelClose />
            <ListItem title="Cerrar Sesión" onClick={handleLogout} panelClose />
          </List>
        </Page>
      </View>
    </Panel>
  );
};

export default MainPanel;
