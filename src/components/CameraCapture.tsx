import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraCaptureProps {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  async function handleCapture() {
    if (!cameraRef.current || capturing || !cameraReady) return;

    try {
      setCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
        exif: false,
      });

      if (photo.uri) {
        onCapture(photo.uri);
      }
    } catch (error) {
      console.error('Erro ao capturar foto:', error);
    } finally {
      setCapturing(false);
    }
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-4 text-white">Verificando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View className="mx-6 items-center rounded-2xl bg-white p-6">
          <Text className="mb-4 text-5xl" style={{ lineHeight: 68 }}>
            📷
          </Text>
          <Text className="mb-2 text-center text-xl font-bold text-gray-800">
            Acesso à câmera
          </Text>
          <Text className="mb-6 text-center text-sm text-gray-600">
            Precisamos da câmera para capturar sua foto de perfil.
          </Text>

          <TouchableOpacity
            className="mb-3 w-full rounded-xl bg-indigo-600 px-6 py-3"
            onPress={requestPermission}
            accessibilityRole="button"
            accessibilityLabel="Conceder permissão para usar a câmera"
          >
            <Text className="text-center font-semibold text-white">
              Conceder permissão
            </Text>
          </TouchableOpacity>

          {!permission.canAskAgain && (
            <TouchableOpacity
              className="mb-3 w-full rounded-xl bg-gray-200 px-6 py-3"
              onPress={() => void Linking.openSettings()}
              accessibilityRole="button"
              accessibilityLabel="Abrir configurações do aplicativo"
            >
              <Text className="text-center font-semibold text-gray-700">
                Abrir configurações
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={onClose} accessibilityRole="button">
            <Text className="text-sm text-gray-500">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        mirror
        onCameraReady={() => setCameraReady(true)}
      />

      <View style={styles.controls}>
        <View className="flex-row justify-end p-4">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-black/50"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar câmera"
          >
            <Text className="text-xl font-bold text-white">×</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1" />

        <View
          className="items-center"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <TouchableOpacity
            className="h-20 w-20 items-center justify-center rounded-full border-4 border-gray-300 bg-white"
            disabled={capturing || !cameraReady}
            onPress={handleCapture}
            style={{ opacity: capturing || !cameraReady ? 0.5 : 1 }}
            accessibilityRole="button"
            accessibilityLabel="Tirar foto"
          >
            <View className="h-16 w-16 rounded-full bg-white" />
          </TouchableOpacity>
          {capturing && <Text className="mt-2 text-sm text-white">Capturando...</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controls: {
    ...StyleSheet.absoluteFill,
    flex: 1,
  },
});
