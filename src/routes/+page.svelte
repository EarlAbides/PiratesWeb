<script lang="ts">
	import type { PageData } from './$types';
	import { cardData } from '$lib/state/cardData.svelte';

	let { data }: { data: PageData } = $props();

	$effect.pre(() => {
		cardData.setCards(data.cards);
	});
</script>

<p>Loaded {data.cards.length} cards</p>
