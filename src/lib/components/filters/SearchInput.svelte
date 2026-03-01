<script lang="ts">
	import { onDestroy } from 'svelte';

	interface Props {
		value: string;
		onchange: (v: string) => void;
	}
	const { value, onchange }: Props = $props();

	let timer: ReturnType<typeof setTimeout>;

	onDestroy(() => clearTimeout(timer));

	function handleInput(e: Event) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			onchange((e.target as HTMLInputElement).value);
		}, 150);
	}
</script>

<input
	type="search"
	class="input input-sm w-full"
	aria-label="Search name or ability"
	placeholder="Search name or ability…"
	{value}
	oninput={handleInput}
/>
