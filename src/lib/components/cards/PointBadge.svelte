<script lang="ts">
	interface Props {
		points: number;
	}

	const { points }: Props = $props();
</script>

<div class="w-12 shrink-0 rounded bg-black/40 px-1 py-0.5 text-center text-xl font-bold text-neutral-100">
	{points}
</div>
