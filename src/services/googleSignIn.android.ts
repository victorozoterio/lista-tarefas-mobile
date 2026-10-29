import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';

let configured = false;

function configureGoogleSignIn() {
  if (configured) {
    return;
  }

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  if (!webClientId) {
    throw new Error('Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID para entrar com Google.');
  }

  GoogleSignin.configure({ webClientId });
  configured = true;
}

export async function getNativeGoogleIdToken(): Promise<string> {
  configureGoogleSignIn();
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

  const result = await GoogleSignin.signIn();

  if (!isSuccessResponse(result)) {
    throw new Error('Login com Google cancelado.');
  }

  const idToken = result.data.idToken;

  if (!idToken) {
    throw new Error('O Google não retornou o token de autenticação.');
  }

  return idToken;
}
