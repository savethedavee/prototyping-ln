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

export {};
