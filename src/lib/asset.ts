/** Resolve a /public path against Vite's base URL, so the site also works from a sub-path. */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '');
