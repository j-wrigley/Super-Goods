import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		})		
	},
	preprocess: [
		preprocess(),
	  ],
	  preprocess: preprocess(),
	  extensions: ['.svelte'],
};