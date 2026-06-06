/**
 * Single source of truth for which routes are reachable without being logged in.
 * Used by both guard layers: the `handle` hook (full reloads, form actions,
 * direct URLs) and the root `+layout.server.ts` load (client-side navigation).
 */
const PUBLIC_PATHS = new Set(['/', '/login', '/so-funktionierts', '/datenschutz', '/impressum']);

export function isPublicPath(pathname: string): boolean {
	if (PUBLIC_PATHS.has(pathname)) return true;
	if (pathname.startsWith('/auth')) return true; // Auth.js login flow
	return false;
}
