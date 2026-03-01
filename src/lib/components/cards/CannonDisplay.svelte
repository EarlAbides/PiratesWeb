<script lang="ts">
	import { base } from '$app/paths';
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
				return [];
			}
		})
	);
</script>

{#if pips.length > 0}
	<div class="inline-flex items-center gap-1 bg-black px-2 py-1">
		<img
			src="{base}/images/icons/cannon.png"
			alt=""
			aria-hidden="true"
			height="22"
			width="41"
			class="shrink-0"
		/>
		{#each pips as pip}
			<span class="shrink-0" style="display:block;height:22px;width:22px">
				<CannonPip type={pip.type} roll={pip.roll} />
			</span>
		{/each}
	</div>
{/if}
