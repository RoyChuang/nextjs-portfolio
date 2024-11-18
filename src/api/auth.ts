import { pb } from '@/lib/pocketbase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    return await pb.collection('users').authWithPassword(
      credentials.email,
      credentials.password
    );
  }
}; 