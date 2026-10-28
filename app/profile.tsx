import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { File, Paths } from 'expo-file-system';
import { useRouter } from 'expo-router';
import { CameraCapture } from '../src/components/CameraCapture';
import { useProfile } from '../src/hooks/useProfile';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]);

  async function handlePhotoCapture(tempUri: string) {
    try {
      const destination = new File(Paths.document, `profile-${Date.now()}.jpg`);
      await new File(tempUri).copy(destination);
      setPhotoUri(destination.uri);
      setShowCamera(false);
    } catch (error) {
      console.error('Erro ao copiar foto:', error);
      Alert.alert('Erro', 'Não foi possível salvar a foto. Tente novamente.');
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      await saveProfile({
        name: name.trim(),
        email: email.trim(),
        photoUri,
      });
      Alert.alert('Perfil salvo', 'Seus dados foram salvos neste aparelho.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text className="mt-3 text-sm text-gray-500">Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-gray-50"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 pb-8 pt-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mb-8 items-center">
            <TouchableOpacity
              className="h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-lg"
              onPress={() => setShowCamera(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={photoUri ? 'Alterar foto de perfil' : 'Adicionar foto de perfil'}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} className="h-full w-full" resizeMode="cover" />
              ) : (
                <View className="items-center">
                  <Text className="mb-1 text-5xl" style={{ lineHeight: 68 }}>
                    📷
                  </Text>
                  <Text className="px-2 text-center text-xs text-gray-500">
                    Adicionar{'\n'}foto
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Text className="mt-2 text-center text-xs text-gray-400">
              Toque para {photoUri ? 'alterar' : 'capturar'} sua foto
            </Text>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Nome
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor="#9ca3af"
              maxLength={100}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Email
            </Text>
            <TextInput
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800"
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor="#9ca3af"
              maxLength={100}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            className={`items-center rounded-xl py-4 ${
              saving ? 'bg-indigo-300' : 'bg-indigo-600'
            }`}
            onPress={handleSave}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Salvar perfil"
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-base font-bold text-white">Salvar perfil</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
