<script lang="ts">
	import CannonPip from '$lib/components/icons/cannons/CannonPip.svelte';
	import { parseCannonPip, type CannonPipData } from '$lib/components/icons/cannons/index';

	interface Props {
		cannons: string[];
	}

	const { cannons }: Props = $props();

	const pips = $derived<CannonPipData[]>(
		cannons.flatMap((c) => {
			try {
				return [parseCannonPip(c)];
			} catch {
				return []; // skip invalid strings silently
			}
		})
	);
</script>

{#if pips.length > 0}
	<div class="flex items-center gap-0.5">
		{#each pips as pip}
			<span class="w-4 h-4 shrink-0"><CannonPip type={pip.type} roll={pip.roll} /></span>
		{/each}
	</div>
{/if}
