<script lang="ts">
	interface Props {
		points: number;
	}

	const { points }: Props = $props();
</script>

<div
	class="flex h-14 w-14 shrink-0 flex-col items-center justify-center border-2 border-black"
	style:background-color="oklch(30% 0.01 0)"
	style:font-family="'Cinzel', serif"
	style:font-weight="700"
>
	<span class="text-3xl leading-none text-neutral-100">{points}</span>
	<span class="mt-0.5 text-[8px] tracking-widest text-neutral-200">POINTS</span>
</div>
