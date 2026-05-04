/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// ─── Brand ───────────────────────────────────────────
				primary: {
					DEFAULT: 'var(--color-primary)',
					dark: 'var(--color-primary-dark)',
					light: 'var(--color-primary-light)'
				},
				// ─── Semantic status ─────────────────────────────────
				success: 'var(--color-success)',
				error: 'var(--color-error)',
				info: 'var(--color-info)'
			},
			borderRadius: {
				card: 'var(--radius-card)'
			},
			boxShadow: {
				card: 'var(--shadow-card)'
			}
		}
	},
	plugins: []
};
