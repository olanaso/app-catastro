import React from 'react';
import { Page, Navbar, NavLeft, Link, List, ListItem, Icon } from 'framework7-react';
import { useAppContext } from '../store/AppContext.jsx';

const PendientesPage = () => {
  const { pendingFichas } = useAppContext();

  return (
    <Page>
      <Navbar title="Pendientes">
        <NavLeft>
          <Link back>
            <Icon f7="chevron_left" />
          </Link>
        </NavLeft>
      </Navbar>
      <List strong inset dividersIos outlineIos>
        {pendingFichas.length === 0 && <ListItem title="No hay fichas pendientes" />}
        {pendingFichas.map((ficha) => (
          <ListItem
            key={ficha.fecha}
            title={ficha.nombre || 'Sin nombre'}
            after={new Date(ficha.fecha).toLocaleString()}
            subtitle={ficha.direccion}
            text={ficha.descripcion}
            className="ficha-list-item"
          >
            {ficha.foto && <img slot="media" src={ficha.foto} alt={ficha.nombre} className="thumbnail" />}
          </ListItem>
        ))}
      </List>
    </Page>
  );
};

export default PendientesPage;
