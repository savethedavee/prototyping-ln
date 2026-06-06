// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session } from '@auth/sveltekit';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth(): Promise<Session | null>;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

// Expose the user id (Google "sub", set in the auth session callback).
declare module '@auth/core/types' {
	interface Session {
		user?: {
			id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
}

export {};
