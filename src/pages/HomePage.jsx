import React, { useEffect, useRef, useState } from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  Link,
  Fab,
  FabButtons,
  FabButton,
  Icon,
  Preloader
} from 'framework7-react';
import mapboxgl from 'mapbox-gl';
import { useRouter } from 'framework7-react';
import { fetchFichas } from '../services/api.js';
import { useAppContext } from '../store/AppContext.jsx';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

const HomePage = () => {
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const { pendingFichas, isOffline } = useAppContext();
  const [remoteFichas, setRemoteFichas] = useState([]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    if (!mapContainerRef.current) {
      return;
    }
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.08175, 4.60971],
      zoom: 12
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      setLoading(false);
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    const loadRemote = async () => {
      if (isOffline) {
        setRemoteFichas([]);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchFichas();
        setRemoteFichas(Array.isArray(data) ? data : data.fichas || []);
      } catch (error) {
        console.warn('No se pudieron obtener fichas remotas', error);
      } finally {
        setLoading(false);
      }
    };
    loadRemote();
  }, [isOffline]);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const allFichas = [...remoteFichas, ...pendingFichas];
    allFichas.forEach((ficha) => {
      if (!ficha.lat || !ficha.lng) {
        return;
      }
      const marker = new mapboxgl.Marker({ color: ficha.offline ? '#f59e0b' : '#0d6efd' })
        .setLngLat([ficha.lng, ficha.lat])
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<strong>${ficha.nombre || 'Sin nombre'}</strong><br/>${ficha.descripcion || ''}`
          )
        )
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [remoteFichas, pendingFichas]);

  return (
    <Page>
      <Navbar title="Mapa de Fichas">
        <NavLeft>
          <Link iconOnly panelOpen="left">
            <Icon f7="menu" />
          </Link>
        </NavLeft>
      </Navbar>
      <div ref={mapContainerRef} className="map-container" />
      {loading && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Preloader color="blue" />
        </div>
      )}
      <Fab position="right-bottom" slot="fixed">
        <FabButton onClick={() => router.navigate('/registrar')}>
          <Icon f7="plus" />
        </FabButton>
        <FabButtons>
          <FabButton onClick={() => router.navigate('/pendientes')}>
            <Icon f7="tray" />
          </FabButton>
          <FabButton onClick={() => router.navigate('/enviar')}>
            <Icon f7="arrow_up_circle" />
          </FabButton>
        </FabButtons>
      </Fab>
    </Page>
  );
};

export default HomePage;
