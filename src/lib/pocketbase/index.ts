import PocketBase, { type AuthRecord } from 'pocketbase';
import { get, writable } from 'svelte/store';
import { PUBLIC_PB_URL } from '$env/static/public';
import { Collections, type TypedPocketBase } from '$types/pocketbase';
import { goto } from '$app/navigation';
import { toast } from 'svelte-sonner';

// USER
export const createPocketBase = (url: string) => {
  const pb = new PocketBase(url) as TypedPocketBase;
  return pb;
};

export const pbClient = createPocketBase(PUBLIC_PB_URL);

export const currentUser = writable<AuthRecord>(pbClient.authStore.record);

pbClient.authStore.onChange((_, record) => {
  currentUser.set(record);
});

export const isLoggedIn = () => {
  return !!get(currentUser);
};

export const login = async (email: string, password: string, redirectUrl: string = '/') => {
  try {
    const { record } = await pbClient
      .collection(Collections.Users)
      .authWithPassword(email, password);
    if (record) {
      currentUser.set(record as AuthRecord);
      toast.success('Login successful');
      goto(redirectUrl);
    }
  } catch {
    toast.error('Invalid credentials');
  }
};

export const defaultLogin = async (redirectUrl: string = '/') => {
  await login('tonda@docuhelper.site', '12345678', redirectUrl);
};

export const logout = () => {
  pbClient.authStore.clear();
  currentUser.set(null);
  goto('/login');
};
