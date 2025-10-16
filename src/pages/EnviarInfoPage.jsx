import React, { useState } from 'react';
import { Page, Navbar, NavLeft, Link, Block, Button, Icon, f7 } from 'framework7-react';
import { useAppContext } from '../store/AppContext.jsx';
import { syncFichas } from '../services/api.js';
import { clearFichas } from '../services/database.js';

const EnviarInfoPage = () => {
  const { pendingFichas, setPendingFichas, isOffline } = useAppContext();
  const [sending, setSending] = useState(false);
  const [resultado, setResultado] = useState('');

  const handleSync = async () => {
    if (isOffline) {
      f7.dialog.alert('Sin conexión. Intente nuevamente cuando tenga internet.');
      return;
    }
    if (pendingFichas.length === 0) {
      f7.dialog.alert('No hay fichas pendientes.');
      return;
    }

    setSending(true);
    setResultado('');
    try {
      await syncFichas(pendingFichas);
      await clearFichas();
      setPendingFichas([]);
      setResultado('Sincronización exitosa.');
    } catch (error) {
      console.error(error);
      setResultado('Ocurrió un error al enviar la información.');
    } finally {
      setSending(false);
    }
  };

  return (
    <Page>
      <Navbar title="Enviar Información">
        <NavLeft>
          <Link back>
            <Icon f7="chevron_left" />
          </Link>
        </NavLeft>
      </Navbar>
      <Block strong inset>
        <p>Fichas pendientes: {pendingFichas.length}</p>
        <Button fill large onClick={handleSync} disabled={sending}>
          {sending ? 'Enviando...' : 'Enviar Información'}
        </Button>
        {resultado && <p style={{ marginTop: 8 }}>{resultado}</p>}
      </Block>
    </Page>
  );
};

export default EnviarInfoPage;
