<script lang="ts">
	import type { CardType } from '$lib/types/cardTypes';

	interface Props {
		type: CardType;
	}

	const { type }: Props = $props();
</script>

<span class="badge badge-sm badge-neutral opacity-70">{type}</span>
