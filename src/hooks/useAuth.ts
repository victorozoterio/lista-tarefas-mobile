import { useCallback, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../services/firebaseConfig';
import type { AuthUser, UseAuthReturn } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

function mapUser(firebaseUser: User): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type !== 'success') {
      return;
    }

    const idToken = response.params.id_token;

    if (!idToken) {
      alert('O Google não retornou o token de autenticação. Tente novamente.');
      return;
    }

    const credential = GoogleAuthProvider.credential(idToken);

    signInWithCredential(auth, credential).catch((error: unknown) => {
      console.error('Erro ao fazer login com Google:', error);
      alert(getErrorMessage(getFirebaseErrorCode(error)));
    });
  }, [response]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? mapUser(firebaseUser) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);
      throw new Error(getErrorMessage(getFirebaseErrorCode(error)));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      console.error('Erro ao criar conta:', error);
      throw new Error(getErrorMessage(getFirebaseErrorCode(error)));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!request) {
      throw new Error('A configuração do Google ainda está sendo preparada. Aguarde um instante.');
    }

    await promptAsync();
  }, [promptAsync, request]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: unknown) {
      console.error('Erro ao sair:', error);
      throw new Error('Não foi possível sair da conta. Tente novamente.');
    }
  }, []);

  return { user, loading, signIn, signUp, signInWithGoogle, signOut };
}

function getFirebaseErrorCode(error: unknown): string {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
}

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'Email não cadastrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };

  return messages[code] ?? 'Erro ao processar sua solicitação.';
}
