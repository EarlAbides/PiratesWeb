<script lang="ts">
	import type { PageData } from './$types';
	import { cardData } from '$lib/state/cardData.svelte';
	import SidebarLayout from '$lib/components/layout/SidebarLayout.svelte';
	import CardTable from '$lib/components/cards/CardTable.svelte';
	import FilterSidebar from '$lib/components/filters/FilterSidebar.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	$effect.pre(() => {
		cardData.setCards(data.cards);
	});
</script>

<SidebarLayout>
	{#snippet sidebar()}
		<FilterSidebar />
	{/snippet}
	<!-- CardTable (Story 2.2) -->
	<CardTable />
</SidebarLayout>
