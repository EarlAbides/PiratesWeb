<script lang="ts">
	import type { PageData } from './$types';
	import { cardData } from '$lib/state/cardData.svelte';
	import SidebarLayout from '$lib/components/layout/SidebarLayout.svelte';

	let { data }: { data: PageData } = $props();

	$effect.pre(() => {
		cardData.setCards(data.cards);
	});
</script>

<SidebarLayout>
	{#snippet sidebar()}
		<!-- FilterSidebar (Story 2.3) -->
		<div class="p-4 text-sm opacity-40">Filters coming in Story 2.3</div>
	{/snippet}
	<!-- CardTable (Story 2.2) -->
	<p class="p-4">Loaded {data.cards.length} cards</p>
</SidebarLayout>
