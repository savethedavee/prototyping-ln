import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';

// Reads AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET from the environment.
// JWT session strategy (default, no DB adapter) → no session collection needed.
export const { handle, signIn, signOut } = SvelteKitAuth({
	providers: [Google],
	trustHost: true, // required behind Netlify / non-Vercel hosts
	pages: { signIn: '/login' }, // eigene, gestylte Login-Seite statt der Auth.js-Default
	callbacks: {
		// Expose the stable Google account id ("sub") on the session so saved
		// searches can be tied to a user later.
		session({ session, token }) {
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}
			return session;
		}
	}
});
