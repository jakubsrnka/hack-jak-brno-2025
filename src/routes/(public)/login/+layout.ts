import { isLoggedIn } from '$lib/pocketbase/';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
    if (isLoggedIn()) throw redirect(303, '/');
};
