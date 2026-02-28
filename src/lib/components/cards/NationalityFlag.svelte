<script lang="ts">
	import type { Nationality } from '$lib/types/cardTypes';
	import { flagUrl } from '$lib/utils/cardUtils';

	interface Props {
		nationality: Nationality;
	}

	const { nationality }: Props = $props();

	let imgEl: HTMLImageElement;
</script>

<img
	bind:this={imgEl}
	src={flagUrl(nationality)}
	alt={nationality}
	width="24"
	height="16"
	class="rounded-sm shrink-0"
	onerror={() => {
		imgEl.style.display = 'none';
	}}
/>
