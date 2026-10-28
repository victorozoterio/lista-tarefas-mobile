export interface UserProfile {
  id: number;
  name: string;
  email: string;
  photoUri: string | null;
}

export interface SaveProfileInput {
  name: string;
  email: string;
  photoUri: string | null;
}
