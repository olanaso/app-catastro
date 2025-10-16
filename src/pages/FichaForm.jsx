import React, { useEffect, useState } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  Link,
  List,
  ListInput,
  ListItem,
  Button,
  Block,
  Icon,
  f7
} from 'framework7-react';
import { saveFicha } from '../services/database.js';
import { takePhoto } from '../services/photo.js';
import { getCurrentPosition } from '../services/geolocation.js';
import { useAppContext } from '../store/AppContext.jsx';

const FichaForm = () => {
  const { setPendingFichas } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [coords, setCoords] = useState({ lat: '', lng: '' });
  const [foto, setFoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const position = await getCurrentPosition();
        setCoords(position);
      } catch (error) {
        console.warn('No se pudo obtener ubicación inicial', error);
      }
    };
    fetchPosition();
  }, []);

  const handleTakePhoto = async () => {
    try {
      const image = await takePhoto();
      if (image) {
        setFoto(image);
      }
    } catch (error) {
      f7.dialog.alert('No se pudo tomar la foto.');
    }
  };

  const handleSave = async () => {
    if (!nombre || !coords.lat || !coords.lng) {
      f7.dialog.alert('Complete al menos nombre y coordenadas.');
      return;
    }
    setSaving(true);
    const ficha = {
      nombre,
      direccion,
      descripcion,
      lat: Number(coords.lat),
      lng: Number(coords.lng),
      foto,
      fecha: Date.now(),
      offline: true
    };
    try {
      await saveFicha(ficha);
      setPendingFichas((prev) => [...prev, ficha]);
      setMensaje('Guardado localmente');
      setNombre('');
      setDireccion('');
      setDescripcion('');
    } catch (error) {
      f7.dialog.alert('No se pudo guardar la ficha.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Navbar title="Registrar Ficha">
        <NavLeft>
          <Link back>
            <Icon f7="chevron_left" />
          </Link>
        </NavLeft>
      </Navbar>
      <List form>
        <ListInput
          label="Nombre"
          type="text"
          placeholder="Nombre de la ficha"
          value={nombre}
          onInput={(event) => setNombre(event.target.value)}
        />
        <ListInput
          label="Dirección"
          type="text"
          placeholder="Dirección"
          value={direccion}
          onInput={(event) => setDireccion(event.target.value)}
        />
        <ListInput
          label="Descripción"
          type="textarea"
          placeholder="Descripción"
          resizable
          value={descripcion}
          onInput={(event) => setDescripcion(event.target.value)}
        />
        <ListItem title="Coordenadas GPS">
          <div slot="after">
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <small>Lat: {coords.lat ? coords.lat.toFixed?.(6) || coords.lat : '—'}</small>
              <small>Lng: {coords.lng ? coords.lng.toFixed?.(6) || coords.lng : '—'}</small>
            </div>
          </div>
        </ListItem>
        <ListItem title="Fotografía">
          <Button small fill onClick={handleTakePhoto}>
            Tomar Foto
          </Button>
          {foto && <img src={foto} alt="Foto ficha" className="thumbnail" slot="after" />}
        </ListItem>
      </List>
      <Block strong inset>
        <Button fill large onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
        {mensaje && <p style={{ marginTop: 8, color: 'var(--ficha-warning)' }}>{mensaje}</p>}
      </Block>
    </Page>
  );
};

export default FichaForm;
