import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  /**
   * The Firebase package exposes this helper to React Native at runtime through
   * Metro's `react-native` condition. Its top-level TypeScript declaration does
   * not include that conditional export, so it is declared here for Expo's
   * type checker as well.
   */
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
