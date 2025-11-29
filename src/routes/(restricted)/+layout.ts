import { isLoggedIn, pbClient } from '$lib/pocketbase/';
import { Collections } from '$types/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
  if (!isLoggedIn()) throw redirect(303, '/login');

  if (pbClient.authStore.isValid) {
    try {
      await pbClient.collection(Collections.Users).authRefresh({ fetch, requestKey: null });
    } catch (e) {
      pbClient.authStore.clear();
      console.log('User not authenticated, redirecting to login', e);
      throw redirect(303, '/login');
    }
  }
};
