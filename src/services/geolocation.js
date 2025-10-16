import { Geolocation } from '@capacitor/geolocation';

export const getCurrentPosition = async () => {
  try {
    const { coords } = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    return { lat: coords.latitude, lng: coords.longitude };
  } catch (error) {
    console.warn('No se pudo obtener geolocalización desde Capacitor, usando navegador', error);
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (err) => reject(err),
          { enableHighAccuracy: true }
        );
      });
    }
    throw error;
  }
};
