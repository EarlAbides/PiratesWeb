import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: '404.html' // SPA mode — GitHub Pages serves 404.html for unmatched routes
		}),
		paths: {
			base: process.env.BASE_PATH ?? '' // '' in dev, '/PiratesWeb' in CI
		}
	}
};

export default config;
