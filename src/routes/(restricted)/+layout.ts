import { isLoggedIn, pbClient } from '$lib/pocketbase/';
import { Collections } from '$types/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
  if (!isLoggedIn()) throw redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);

  if (pbClient.authStore.isValid) {
    try {
      await pbClient.collection(Collections.Users).authRefresh({ fetch, requestKey: null });
    } catch (e) {
      pbClient.authStore.clear();
      console.log('User not authenticated, redirecting to login', e);
      throw redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
    }
  }
};
