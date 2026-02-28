<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		sidebar: Snippet;
		children: Snippet;
	}

	let { sidebar, children }: Props = $props();
</script>

<div class="flex flex-1 flex-col xl:flex-row xl:overflow-hidden">
	<aside
		aria-label="Filters"
		class="w-full border-b border-neutral-800 xl:w-72 xl:shrink-0 xl:overflow-y-auto xl:border-r xl:border-b-0"
	>
		{@render sidebar()}
	</aside>
	<main class="flex-1 overflow-y-auto">
		{@render children()}
	</main>
</div>
