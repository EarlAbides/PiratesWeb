import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html' // SPA mode — all routes served by index.html on GitHub Pages
		}),
		paths: {
			base: process.env.BASE_PATH ?? '' // '' in dev, '/PiratesWeb' in CI
		}
	}
};

export default config;
