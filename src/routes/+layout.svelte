<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import AppHeader from '$lib/components/layout/AppHeader.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap" rel="stylesheet" />
</svelte:head>

<div
	data-theme="dark"
	class="flex min-h-screen flex-col"
	style:--bg-texture-spanish-main="url('{base}/images/backgrounds/TanBG.jpg')"
	style:--bg-texture-crimson-coast="url('{base}/images/backgrounds/RedBG.jpg')"
	style:--bg-texture-revolution="url('{base}/images/backgrounds/BlueBG.jpg')"
>
	<AppHeader />
	{@render children()}
</div>
