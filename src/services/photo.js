import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export const takePhoto = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 70,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    return image.dataUrl;
  } catch (error) {
    console.warn('No se pudo acceder a la cámara, solicitando imagen desde archivos', error);
    if (error.message?.includes('User cancelled photos app')) {
      throw error;
    }
    return null;
  }
};
