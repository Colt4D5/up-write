import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async (event) => {
    // If user is logged in, redirect to dashboard
    if (event.locals.session) {
        return redirect(302, '/dashboard');
    }
    
    // If user is not logged in, show landing page
    return {
        isLoggedIn: false
    };
};

export const actions: Actions = {
    logout: async (event) => {
        // If user has a session, invalidate it
        if (event.locals.session) {
            await auth.invalidateSession(event.locals.session.id);
        }
        
        // Delete the session cookie
        auth.deleteSessionTokenCookie(event);
        
        // Redirect to login page
        return redirect(302, '/login');
    }
};